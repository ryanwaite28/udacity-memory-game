(function(){


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

  let deck = document.getElementById('deck');
  let movesCount = document.getElementById('moves-count');
  let starsList = document.getElementById('stars-list');
  let resetBtn = document.getElementById('reset-btn');
  let hintBtn = document.getElementById('hint-btn');
  let msgText = document.getElementById('msg-text');

  let moves = 5;
  let isGameOver = false;

  let matches = [];
  let lastFlipped = null;
  let pause = false;

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

  resetBtn.addEventListener('click', function() {
    resetGame();
  });

  hintBtn.addEventListener('click', function() {
    hint();
  });

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
        if (card === lastFlipped || matches.includes(card) || pause || isGameOver) {
          return;
        }

        card.classList.add('open', 'show');

        if (lastFlipped) {
          let thisCard = card.childNodes[0].getAttribute('data-card');
          let lastCard = lastFlipped.childNodes[0].getAttribute('data-card');
          if (thisCard === lastCard) {
            let message = 'match found!';
            console.log(message);
            flash_msg(message);
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
            moves--;
            starsList.removeChild(starsList.children[0]);
            movesCount.innerText = moves;
            setTimeout(function() {
              card.classList.remove('open', 'show');
              lastFlipped.classList.remove('open', 'show');
              lastFlipped = null;
              pause = false;
            }, 1725);
            if(moves === 0) {
              gameOver();
              return;
            }
          }
        }
        else {
          lastFlipped = card;
        }
      });
    });
  }

  function getRandomItem(array_obj) {
    return array_obj[Math.floor(Math.random() * array_obj.length)];
  }

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

  function start() {
    generateCards();
    activateCards();
    flash_cards();
    console.log('game started.');
  }

  function gameOver() {
    let msg = moves > 0 ? 'You Win!' : 'You Lose...';
    console.log(msg);
    alert(msg);
    isGameOver = true;
    flash_msg(msg);
  }

  function resetGame() {
    clearDeck();
    generateCards();
    activateCards();
    flash_cards();

    moves = 5;
    isGameOver = false;
    matches = [];
    lastFlipped = null;
    pause = false;

    starsList.innerHTML = '';
    movesCount.innerText = moves;
    for(var i = 0; i < moves; i++) {
      starsList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    }
    flash_msg('New Game!');
    console.log('game re-started.');
  }

  function flash_msg(message) {
    msgText.innerText = message;
    setTimeout(function(){ msgText.innerText = ''; }, 1725);
  }

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

  // Referenced live webinar walkthrough with Mike Wales, https://developer.mozilla.org and https://www.w3schools.com for functions and process.

  start();

})()
