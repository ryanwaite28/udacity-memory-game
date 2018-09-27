$(document).ready(function(){
  $('.modal').modal();

  /* get all DOM elements and set all game state variables */

  let cardClassesList = [
    'fa-diamond',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-bomb',
    'fa-bomb',
    'fa-bicycle',
    'fa-bicycle',
    'fa-leaf',
    'fa-leaf'
  ];

  let watch = new StopWatch();

  let modal = document.getElementById('game_modal');
  let modal_instance = M.Modal.getInstance(modal);
  let deck = document.getElementById('deck');
  let gradeSpan = document.getElementById('grade');
  let starsList = document.getElementById('stars-list');
  let resetBtn = document.getElementById('reset-btn');
  let infoBtn = document.getElementById('info-btn');
  let msgText = document.getElementById('msg-text');
  let movesText = document.getElementById('moves-text');
  let timeText = document.getElementById('time-text');

  let time_results = document.getElementById('time_results');
  let moves_results = document.getElementById('moves_results');
  let grade_results = document.getElementById('grade_results');
  let modal_reset_btn = document.getElementById('modal_reset_btn');

  let moves = 0;
  let grade = 'Great!';

  let isGameOver = false;
  let didGameStart = false;

  let matches = [];
  let lastFlipped = null;
  let pause = false;

  gradeSpan.innerText = grade;
  movesText.innerText = moves;
  timeText.innerText = watch.getTimeString();

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // creates li cards, gives data-card attr to each
  function createCard(card_class) {
    let li = document.createElement('li');
    li.classList.add('card');
    li.classList.add('card-' + card_class);
    li.setAttribute('data-card', card_class);
    let i = document.createElement('i');
    i.classList.add('card-icon', 'fa', card_class);
    i.setAttribute('data-card', card_class);
    li.appendChild(i);
    return li;
  }

  resetBtn.addEventListener('click', resetGame);
  modal_reset_btn.addEventListener('click', resetGame);
  infoBtn.addEventListener('click', info);

  // updates grade with every move
  function updateGrade() {
    if(moves > 12) {
      if(grade !== "Average") {
        grade = "Average";
        gradeSpan.innerText = grade;
        starsList.removeChild(starsList.children[0]);
      }
    }
    if(moves > 24) {
      if(grade !== "Poor...") {
        grade = "Poor...";
        gradeSpan.innerText = grade;
        starsList.removeChild(starsList.children[0]);
      }
    }
  }

  function clearDeck() {
    deck.innerHTML = '';
  }

  function generateCards() {
    let card_classes = shuffle(cardClassesList);
    for(let index = 0; index < 16; index++) {
      let card_class = card_classes[index];
      let new_elm = createCard(card_class);
      deck.appendChild(new_elm);
    }
  }

  function activateCards() {
    document.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('click', function() {
        if(didGameStart === false) {
          // set timer on first click
          didGameStart = true;
          watch.startTimer(function(){
            timeText.innerText = watch.getTimeString();
          });
        }
        if (card === lastFlipped || matches.includes(card) || pause || isGameOver) {
          // prevents comparing cards to themselves or playing when game is over
          return;
        }

        card.classList.add('open', 'show');

        if (lastFlipped) { // a previous card was clicked; compare last clicked to this click
          let thisCard = card.childNodes[0].getAttribute('data-card');
          let lastCard = lastFlipped.childNodes[0].getAttribute('data-card');
          moves++;
          movesText.innerText = moves;
          updateGrade();

          if (thisCard === lastCard) {
            let message = 'match found!';
            console.log(message);
            flash_msg(message);
            card.classList.add('match');
            lastFlipped.classList.add('match');
            matches.push(card);
            matches.push(lastFlipped);
            lastFlipped = null;
            if(matches.length === 16) {
              gameOver();
              return;
            }
          }
          else {
            let message = 'no match.';
            console.log(message);
            flash_msg(message);
            pause = true;
            setTimeout(function() {
              card.classList.remove('open', 'show');
              lastFlipped.classList.remove('open', 'show');
              lastFlipped = null;
              pause = false;
            }, 1725);
          }
        }
        else {
          // first click, so save it as a reference
          lastFlipped = card;
        }
      });
    });
  }

  function getRandomItem(array_obj) {
    return array_obj[Math.floor(Math.random() * array_obj.length)];
  }

  /*
    finds a card that is not matched yet,
    get its card class then find the other that matches,
    then shows both for a few moments
  */
  function hint() {
    let hiddenCards = Array.from(document.querySelectorAll('.card')).filter(function(card){
      return card.classList.contains('open') === false;
    });
    let cardItem = getRandomItem(hiddenCards);
    let card_name = '.card-' + cardItem.getAttribute('data-card');

    pause = true;
    document.querySelectorAll(card_name).forEach(function(card) {
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll(card_name).forEach(function(card) {
        card.classList.remove('open', 'show');
      });
      pause = false;
    }, 3000);
  }

  function info() {
    alert('Grading System: \n\n\
    0-12 Moves = Great! \n\
    13-24 Moves = Average \n\
    25+ Moves = Poor...  \
    ');
  }

  function start() {
    generateCards();
    activateCards();
    flash_cards();
    console.log('game started.');
  }

  /* sets the info in the modal */
  function gameOver() {
    isGameOver = true;
    watch.stopTimer();

    grade_results.innerText = grade;
    moves_results.innerText = moves;
    time_results.innerText = watch.getTimeString();

    modal_instance.open();
  }

  /* Resets the game */
  function resetGame(e) {
    if(e && e.preventDefault) { e.preventDefault(); }

    // clears board then regenerate cards
    clearDeck();
    generateCards();
    activateCards();
    flash_cards();
    watch.resetTimer();

    // reset game state
    moves = 0;
    grade = 'Great!';
    isGameOver = false;
    matches = [];
    lastFlipped = null;
    pause = false;
    didGameStart = false;

    // reset DOM state
    starsList.innerHTML = '';
    starsList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    starsList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    starsList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    gradeSpan.innerText = grade;
    movesText.innerText = moves;
    timeText.innerText = watch.getTimeString();

    flash_msg('New Game!');
    console.log('game re-started.');
  }

  function flash_msg(message) {
    msgText.innerText = message;
    setTimeout(function(){ msgText.innerText = ''; }, 1725);
  }

  /* add the show/open classes then removes them after timeout */
  function flash_cards() {
    document.querySelectorAll('.card').forEach(function(card) {
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll('.card').forEach(function(card) {
        card.classList.remove('open', 'show');
      });
    }, 3000);
  }

  start();
});
