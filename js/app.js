(function(){


  const card = document.getElementsByClassName('card');
  const allCards = Array.from(card);

  const flippedCards = [];
  const matchedCards = [];

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

  function createCard() {
    return (`<li class="card"><i class="fa ${card}"></i></li>`);
  }

  function start() {
    const deck = document.querySelector('.deck');
    let fullDeck = shuffle(allCards).map(function(card) {
      return createCard(card);
      console.log('hahaha');
    });
  }

  start();

  let movesCount = document.getElementById('moves-count');
  let starsList = document.getElementById('stars-list');
  let resetBtn = document.getElementById('reset-btn');
  let msgText = document.getElementById('msg-text');

  let moves = 3;
  let isGameOver = false;

  let matches = [];
  let lastFlipped = null;
  let pause = false;

  resetBtn.addEventListener('click', function() {
    resetGame();
  });

  allCards.forEach(function(card) {
    card.addEventListener('click', function() {
      if (card === lastFlipped || matches.includes(card) || pause || isGameOver) {
        return;
      }

      card.classList.add('open', 'show');

      if (lastFlipped) {
        if (card.childNodes[1].classList.item(1) === lastFlipped.childNodes[1].classList.item(1)) {
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
      } else {
        lastFlipped = card;
      }
    });
  });

  function gameOver() {
    let msg = 'Game Over...';
    console.log(msg);
    alert(msg);
    isGameOver = true;
    flash_msg(msg);
  }

  function resetGame() {
    moves = 3;
    isGameOver = false;

    matches = [];
    lastFlipped = null;
    pause = false;

    starsList.innerHTML = '';
    movesCount.innerText = moves;
    for(var i = 0; i < moves; i++) {
      starsList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    }
    allCards.forEach(function(card) {
      card.classList.remove('open', 'show');
    });
    flash_msg('New Game!');
  }

  function flash_msg(message) {
    msgText.innerText = message;
    setTimeout(function(){ msgText.innerText = ''; }, 1725);
  }

  // Referenced live webinar walkthrough with Mike Wales, https://developer.mozilla.org and https://www.w3schools.com for functions and process.



})()
