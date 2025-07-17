// script.js

// Selección de elementos del DOM
const editButton = document.querySelector(".profile__edit-button");
const popup = document.querySelector(".popup");
const closeButton = document.querySelector(".popup__close-button");
const form = document.querySelector(".popup__form");
const nameInput = form.elements.name;
const aboutInput = form.elements.about;
const saveButton = document.querySelector(".popup__save-button");
const profileName = document.querySelector(".profile__name");
const profileOccupation = document.querySelector(".profile__occupation");

// Función para abrir el popup y precargar datos
function openPopup() {
  nameInput.value = profileName.childNodes[0].nodeValue.trim();
  aboutInput.value = profileOccupation.textContent;
  validateForm(); // valida los campos antes de habilitar el botón
  popup.classList.add("popup_opened");
}

// Función para cerrar el popup
function closePopup() {
  popup.classList.remove("popup_opened");
}

// Función para manejar el envío del formulario
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.childNodes[0].nodeValue = nameInput.value + " ";
  profileOccupation.textContent = aboutInput.value;
  closePopup();
}

// Función de validación en tiempo real
function validateForm() {
  if (nameInput.validity.valid && aboutInput.validity.valid) {
    saveButton.disabled = false;
  } else {
    saveButton.disabled = true;
  }
}

// Listeners
editButton.addEventListener("click", openPopup);
closeButton.addEventListener("click", closePopup);
form.addEventListener("submit", handleFormSubmit);
nameInput.addEventListener("input", validateForm);
aboutInput.addEventListener("input", validateForm);

// Funcionalidad del botón "Me gusta"
const likeButtons = document.querySelectorAll(".card__like-button");

likeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("card__like-button_active");
  });
});
