// src/components/PopupWithForms.js
import { Popup } from "./Popup.js";

export class PopupWithForms extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);

    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._inputList = Array.from(this._form.querySelectorAll(".popup__input"));

    this._submitButton = this._form.querySelector(".popup__save-button");
    this._defaultButtonText = this._submitButton
      ? this._submitButton.textContent
      : "";
  }

  _getInputValues() {
    const formValues = {};

    this._inputList.forEach((input) => {
      formValues[input.name] = input.value;
    });

    return formValues;
  }

  renderLoading(isLoading, loadingText = "Guardando...") {
    if (!this._submitButton) return;

    this._submitButton.textContent = isLoading
      ? loadingText
      : this._defaultButtonText;
  }

  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}
