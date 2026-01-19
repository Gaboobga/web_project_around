// src/components/PopupWithConfirmation.js
import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector(".popup__form");
    this._handleSubmit = null;
    this._submitButton = this._form.querySelector(".popup__save-button");
    this._defaultButtonText = this._submitButton.textContent;
  }

  setSubmitAction(action) {
    this._handleSubmit = action;
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
      if (this._handleSubmit) {
        this._handleSubmit();
      }
    });
  }

  close() {
    super.close();
    this.setSubmitAction(null);
  }
}
