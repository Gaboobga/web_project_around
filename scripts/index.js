// scripts/index.js

import { openPopup, closePopup } from "./utils.js";
import { Card } from "./Card.js";
import { FormValidator } from "./FormValidator.js";

/* Datos iniciales */
const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg",
  },
  {
    name: "Parque Nacional de Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg",
  },
];

/* Selectores generales */
const cardsContainer = document.querySelector(".cards");
const cardTemplateSelector = "#card-template";

/* Popups */
const popupEditProfile = document.querySelector(".popup_type_edit-profile");
const popupAddCard = document.querySelector(".popup_type_add-card");
const popupImage = document.querySelector(".popup_type_image");

/* Elementos del perfil */
const profileName = document.querySelector(".profile__name");
const profileOccupation = document.querySelector(".profile__occupation");
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

/* Formularios */
const formEditProfile = popupEditProfile.querySelector(".popup__form");
const formAddCard = popupAddCard.querySelector(".popup__form");

/* Inputs del formulario de perfil */
const nameInput = formEditProfile.elements.name;
const aboutInput = formEditProfile.elements.about;

/* Inputs del formulario de nueva tarjeta */
const titleInput = formAddCard.elements.title;
const linkInput = formAddCard.elements.link;

/* Elementos del popup de imagen */
const popupImageElement = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");

/* Configuración de validación */
const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__save-button",
  inactiveButtonClass: "popup__save-button_disabled",
  inputErrorClass: "popup__input_invalid",
  errorClass: "popup__error_visible",
};

/* Instancias de validación */
const editProfileValidator = new FormValidator(
  validationConfig,
  formEditProfile
);
editProfileValidator.setEventListeners();

const addCardValidator = new FormValidator(validationConfig, formAddCard);
addCardValidator.setEventListeners();

/* Función de callback para el click en la imagen de la tarjeta */
function handleCardClick(name, link) {
  popupImageElement.src = link;
  popupImageElement.alt = name;
  popupImageCaption.textContent = name;
  openPopup(popupImage);
}

/* Crear tarjeta usando la clase Card */
function createCard(data) {
  const card = new Card(data, cardTemplateSelector, handleCardClick);
  return card.generateCard();
}

/* Renderizar tarjetas iniciales */
function renderInitialCards() {
  initialCards.forEach((item) => {
    const cardElement = createCard(item);
    cardsContainer.append(cardElement);
  });
}

/* Manejo del perfil */
editProfileButton.addEventListener("click", () => {
  nameInput.value = profileName.firstChild.textContent.trim();
  aboutInput.value = profileOccupation.textContent.trim();
  editProfileValidator.resetValidation();
  openPopup(popupEditProfile);
});

formEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileName.firstChild.textContent = nameInput.value.trim();
  profileOccupation.textContent = aboutInput.value.trim();

  closePopup(popupEditProfile);
});

/* Manejo de nueva tarjeta */
addCardButton.addEventListener("click", () => {
  formAddCard.reset();
  addCardValidator.resetValidation();
  openPopup(popupAddCard);
});

formAddCard.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = titleInput.value.trim();
  const link = linkInput.value.trim();

  const newCardElement = createCard({ name, link });
  cardsContainer.prepend(newCardElement);

  closePopup(popupAddCard);
  formAddCard.reset();
  addCardValidator.resetValidation();
});

/* Botones de cerrar */
const closeButtons = document.querySelectorAll(".popup__close-button");
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

/* Render inicial */
renderInitialCards();
