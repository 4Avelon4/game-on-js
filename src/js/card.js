export default function createCard(number, cardStyle) {
  const card = document.createElement('li');
  const cardFrontFace = document.createElement('div');
  const cardBackFace = document.createElement('img');

  card.classList.add('memory-game__card', 'card');
  card.dataset.number = number;
  cardFrontFace.classList.add('card__front-face');
  cardFrontFace.textContent = number;
  cardBackFace.classList.add('card__back-face');
  cardBackFace.src = cardStyle;
  cardBackFace.alt = 'Memory-card';

  card.append(cardFrontFace);
  card.append(cardBackFace);

  return card;
}
