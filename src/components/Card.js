// src/components/Card.js
export class Card {
  constructor(
    data,
    templateSelector,
    { handleCardClick, handleLikeClick, handleDeleteClick, userId },
  ) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._isLiked = data.isLiked;

    this._ownerId = data.owner;

    this._templateSelector = templateSelector;

    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;

    this._userId = userId;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  _setLikeState() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  // Método para actualizar estado tras respuesta del server
  setIsLiked(isLiked) {
    this._isLiked = isLiked;
    this._setLikeState();
  }

  // Método para eliminar la tarjeta
  removeCard() {
    this._element.remove();
    this._element = null;
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this);
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteClick(this);
    });

    this._imageElement.addEventListener("click", () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  generateCard() {
    this._element = this._getTemplate();

    this._imageElement = this._element.querySelector(".card__image");
    this._titleElement = this._element.querySelector(".card__title");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    // Setear estado inicial del like desde server
    this._setLikeState();

    // Ocultar papelera si no es dueño
    if (this._ownerId !== this._userId) {
      this._deleteButton.remove();
    }

    this._setEventListeners();

    return this._element;
  }

  // getters
  getId() {
    return this._id;
  }

  isLiked() {
    return this._isLiked;
  }
}
