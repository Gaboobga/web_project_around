// scripts/index.js

import { Card } from "../components/Card.js";
import { FormValidator } from "../components/FormValidator.js";
import { Section } from "../components/Section.js";
import { PopupWithImage } from "../components/PopupWithImage.js";
import { UserInfo } from "../components/UserInfo.js";
import { PopupWithForms } from "../components/PopupWithForms.js";
import { Api } from "../components/Api.js";
import { PopupWithConfirmation } from "../components/PopupWithConfirmation.js";

const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "e43b7e13-9b4c-44b0-bf36-7f1f9d2c8733",
    "Content-Type": "application/json",
  },
});

/* Selectores generales */
const cardTemplateSelector = "#card-template";

/* Popups */
const popupEditProfile = document.querySelector(".popup_type_edit-profile");
const popupAddCard = document.querySelector(".popup_type_add-card");
const popupEditAvatar = document.querySelector(".popup_type_edit-avatar");

const imagePopup = new PopupWithImage(".popup_type_image");
imagePopup.setEventListeners();

const confirmDeletePopup = new PopupWithConfirmation(
  ".popup_type_confirm-delete",
);
confirmDeletePopup.setEventListeners();

/* Elementos del perfil */
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const editAvatarButton = document.querySelector(".profile__avatar-edit-button");

/* UserInfo */
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__occupation",
  avatarSelector: ".profile__avatar",
});

/* Formularios */
const formEditProfile = popupEditProfile.querySelector(".popup__form");
const formAddCard = popupAddCard.querySelector(".popup__form");
const formEditAvatar = popupEditAvatar.querySelector(".popup__form");

/* Inputs del formulario de perfil */
const nameInput = formEditProfile.elements.name;
const aboutInput = formEditProfile.elements.about;

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
  formEditProfile,
);
editProfileValidator.setEventListeners();

const addCardValidator = new FormValidator(validationConfig, formAddCard);
addCardValidator.setEventListeners();

const editAvatarValidator = new FormValidator(validationConfig, formEditAvatar);
editAvatarValidator.setEventListeners();

/* Popup: Editar Perfil (PATCH /users/me) */
const editProfilePopup = new PopupWithForms(
  ".popup_type_edit-profile",
  (inputValues) => {
    editProfilePopup.renderLoading(true);

    api
      .updateUserInfo({
        name: inputValues.name,
        about: inputValues.about,
      })
      .then((userData) => {
        userInfo.setUserInfo({
          name: userData.name,
          job: userData.about,
        });
        editProfilePopup.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        editProfilePopup.renderLoading(false);
      });
  },
);
editProfilePopup.setEventListeners();

/* Popup: Añadir Tarjeta (POST /cards) */
const addCardPopup = new PopupWithForms(
  ".popup_type_add-card",
  (inputValues) => {
    addCardPopup.renderLoading(true);

    api
      .addCard({
        name: inputValues.title,
        link: inputValues.link,
      })
      .then((cardData) => {
        const newCardElement = createCard(cardData);
        cardSection.addItem(newCardElement);
        addCardPopup.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        addCardPopup.renderLoading(false);
      });
  },
);
addCardPopup.setEventListeners();

/* Popup: Editar Avatar (PATCH /users/me/avatar) */
const editAvatarPopup = new PopupWithForms(
  ".popup_type_edit-avatar",
  (inputValues) => {
    editAvatarPopup.renderLoading(true);

    api
      .updateAvatar({ avatar: inputValues.avatar })
      .then((userData) => {
        userInfo.setUserAvatar(userData.avatar);
        editAvatarPopup.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        editAvatarPopup.renderLoading(false);
      });
  },
);
editAvatarPopup.setEventListeners();

/* Callback: abrir imagen */
function handleCardClick(name, link) {
  imagePopup.open(name, link);
}

/* Likes */
function handleLikeClick(cardInstance) {
  const cardId = cardInstance.getId();

  const request = cardInstance.isLiked()
    ? api.unlikeCard(cardId)
    : api.likeCard(cardId);

  request
    .then((updatedCard) => {
      cardInstance.setIsLiked(updatedCard.isLiked);
    })
    .catch((err) => {
      console.log(err);
    });
}

/* Delete con confirmación */
function handleDeleteClick(cardInstance) {
  confirmDeletePopup.setSubmitAction(() => {
    confirmDeletePopup.renderLoading(true);

    api
      .deleteCard(cardInstance.getId())
      .then(() => {
        cardInstance.removeCard();
        confirmDeletePopup.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        confirmDeletePopup.renderLoading(false);
      });
  });

  confirmDeletePopup.open();
}

/* Crear tarjeta */
let currentUserId = null;

function createCard(data) {
  const card = new Card(data, cardTemplateSelector, {
    handleCardClick,
    handleLikeClick,
    handleDeleteClick,
    userId: currentUserId,
  });

  return card.generateCard();
}

/* Sección de tarjetas */
const cardSection = new Section(
  {
    items: [],
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  ".cards",
);

/* Cargar datos iniciales (user + cards) */
api
  .getInitialData()
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
    });

    userInfo.setUserAvatar(userData.avatar);

    cards.forEach((cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });

/* Abrir popup editar perfil */
editProfileButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();

  nameInput.value = userData.name;
  aboutInput.value = userData.job;

  editProfileValidator.resetValidation();
  editProfilePopup.open();
});

/* Abrir popup añadir tarjeta */
addCardButton.addEventListener("click", () => {
  formAddCard.reset();
  addCardValidator.resetValidation();
  addCardPopup.open();
});

/* Abrir popup editar avatar */
editAvatarButton.addEventListener("click", () => {
  formEditAvatar.reset();
  editAvatarValidator.resetValidation();
  editAvatarPopup.open();
});
