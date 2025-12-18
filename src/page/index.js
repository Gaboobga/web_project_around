// scripts/index.js

import { Card } from "../components/Card.js";
import { FormValidator } from "../components/FormValidator.js";
import { Section } from "../components/Section.js";
import { Popup } from "../components/Popup.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { UserInfo } from "../components/UserInfo.js";
import { PopupWithForms } from "../components/PopupWithForms.js";

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

const imagePopup = new PopupWithImage(".popup_type_image");
imagePopup.setEventListeners();

//* Elementos del perfil */
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

/* Popup Editar Perfil */
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__occupation",
});

const editProfilePopup = new PopupWithForms(
  ".popup_type_edit-profile",
  (inputValues) => {
    userInfo.setUserInfo({
      name: inputValues.name,
      job: inputValues.about,
    });
  }
);

editProfilePopup.setEventListeners();
const addCardPopup = new PopupWithForms(
  ".popup_type_add-card",
  (inputValues) => {
    const newCardElement = createCard({
      name: inputValues.title,
      link: inputValues.link,
    });

    cardSection.addItem(newCardElement);
  }
);

addCardPopup.setEventListeners();

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
  imagePopup.open(name, link);
}

/* Crear tarjeta usando la clase Card */
function createCard(data) {
  const card = new Card(data, cardTemplateSelector, handleCardClick);
  return card.generateCard();
}

let cardSection;

cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  ".cards"
);

cardSection.renderItems();

/* Manejo del perfil */
editProfileButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();

  nameInput.value = userData.name;
  aboutInput.value = userData.job;

  editProfileValidator.resetValidation();
  editProfilePopup.open();
});

/* Manejo de nueva tarjeta */
addCardButton.addEventListener("click", () => {
  formAddCard.reset();
  addCardValidator.resetValidation();
  addCardPopup.open();
});
