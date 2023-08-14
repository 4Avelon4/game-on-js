// Вставка стилей
import '@/style/style.styl';
import createCard from './card';

const cardsWrapper = document.getElementById('memory-game__cards');
const headerBottomItems = document.querySelector('.header-bottom__items');
const timerDescr = document.querySelector('.timer__descr');
const timerDefaultValue = 60;
let [time, timeToggler, timerValue] = [null, false, timerDefaultValue];
const endGameMessage = document.querySelector('.end-game');

timerDescr.textContent = timerValue;

function startGameTimer() {
  countdown();

  function countdown() {
    timerDescr.textContent = timerValue;
    timerValue--;

    if (timerValue < 0) {
      cardsWrapper.classList.add('--active-none');
      endGameMessage.classList.add('--active-flex');
      timeToggler = false;
      clearTimeout(time);
      clearGame();
      toggleRecreateGameButton();
    } else {
      time = setTimeout(countdown, 1000);
    }
  }
}

let [cardsNumberArray, cardsCount] = [[], 4];
let cardStyle = 'img/js-badge.svg';

function createGame() {
  buttonNewGame.classList.remove('--active-block');
  cardsWrapper.classList.remove('--active-none');
  endGameMessage.classList.remove('--active-flex');
  timerValue = timerDefaultValue;
  timerDescr.textContent = timerValue;

  for (let i = 1; i <= cardsCount ** 2 / 2; i++) {
    cardsNumberArray.push(i, i);
  }

  for (let i = cardsNumberArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsNumberArray[i], cardsNumberArray[j]] = [
      cardsNumberArray[j],
      cardsNumberArray[i],
    ];
  }

  for (const cardNumber of cardsNumberArray) {
    cardsWrapper.append(createCard(cardNumber, cardStyle));
  }

  runGameLogic();
}

const form = document.querySelector('.form');
const timer = document.querySelector('.header-bottom__timer');
let [firstCard, secondCard] = [null, null];

function runGameLogic() {
  const cards = document.querySelectorAll('.memory-game__card');
  let [hasFlippedCard, lockBoard] = [false, false];

  function flipCard() {
    headerBottomItems.classList.contains('--active-flex') &&
      headerBottomItems.classList.remove('--active-flex');

    form.classList.contains('--active-flex') &&
      form.classList.remove('--active-flex');

    timer.classList.contains('--active-none') &&
      timer.classList.remove('--active-none');

    if (!timeToggler) {
      timeToggler = true;
      startGameTimer();
    }

    if (lockBoard && ![firstCard, secondCard].includes(this)) {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();

      return;
    }

    if (this === firstCard) {
      return;
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;

      return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();

    if (
      document.querySelectorAll('.memory-game__card.card.flip').length ===
      cardsNumberArray.length
    ) {
      clearTimer();
      toggleRecreateGameButton();
    }
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.number === secondCard.dataset.number;

    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      if (firstCard !== null && secondCard !== null) {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
      }

      clearTimeout();
    }, 3000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  cards.forEach((card) => card.addEventListener('click', flipCard));
  document.location.href = '#timer';
}

const buttonNewGame = document.querySelector('.footer__button');

function toggleRecreateGameButton() {
  buttonNewGame.classList.add('--active-block');
  document.location.href = '#footer__button';

  buttonNewGame.addEventListener('click', () => {
    clearGame();
    createGame();
  });
}

function clearGame() {
  while (cardsWrapper.lastChild) {
    cardsWrapper.removeChild(cardsWrapper.lastChild);
  }

  cardsNumberArray = [];
  [firstCard, secondCard] = [null, null];
}

function clearTimer() {
  timeToggler = false;
  clearTimeout(time);
}

(function selectionDifficultyGame() {
  const inputForm = document.querySelector('.form__input');
  const buttonForm = document.querySelector('.form__button');

  buttonForm.disabled = true;

  inputForm.addEventListener('input', () => {
    buttonForm.disabled = inputForm.value === '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    timer.classList.contains('--active-none') &&
      timer.classList.remove('--active-none');

    if (!inputForm.value) {
      return;
    }

    if ([2, 4, 6, 8, 10].includes(+inputForm.value)) {
      cardsCount = +inputForm.value;
    }

    form.classList.remove('--active-flex');
    document.documentElement.style.setProperty('--card-count', cardsCount);
    document
      .querySelector('.header-top__link--form')
      .classList.remove('--active-link');
    clearTimer();
    clearGame();
    createGame();
    buttonForm.disabled = true;
    inputForm.value = '';
    form.classList.remove('--active-block');
    buttonNewGame.classList.remove('--active-block');

    document.location.href = '#timer';
  });
})();

const headerLink = document.querySelectorAll('.header-top__link');

headerLink.forEach((link) =>
  link.addEventListener('click', (event) => {
    const targetForm = event.target.dataset.link === 'form';

    targetForm
      ? toggleOptionsGame(link, form, headerBottomItems)
      : toggleOptionsGame(link, headerBottomItems, form);
  })
);

function toggleOptionsGame(linkElement, addElement, removeElement) {
  removeElement.classList.contains('--active-flex') &&
    removeElement.classList.remove('--active-flex');

  !timer.classList.contains('--active-none') &&
    timer.classList.add('--active-none');

  headerLink.forEach((link) => link.classList.remove('--active-link'));

  if (addElement.classList.contains('--active-flex')) {
    linkElement.classList.remove('--active-link');
    addElement.classList.remove('--active-flex');
    timer.classList.remove('--active-none');
  } else {
    linkElement.classList.add('--active-link');
    addElement.classList.add('--active-flex');
  }
}

document.querySelectorAll('.header-bottom__item').forEach((imgStyle) => {
  ['click', 'keydown'].forEach((eventTarget) => {
    imgStyle.addEventListener(eventTarget, (event) => {
      if (eventTarget === 'click' || event.keyCode === 13) {
        const style = event.currentTarget.dataset.style;

        cardStyle = style;
        document
          .querySelector('.header-top__link--img')
          .classList.remove('--active-link');

        timer.classList.contains('--active-none') &&
          timer.classList.remove('--active-none');

        headerBottomItems.classList.remove('--active-flex');
        document.documentElement.style.setProperty('--card-count', cardsCount);
        clearTimer();
        clearGame();
        createGame();
        document.location.href = '#timer';
      }
    });
  });
});
