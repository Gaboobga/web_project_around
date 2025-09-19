/* scripts/validate.js */
(function (global) {
  /*Helpers de error*/
  function showInputError(input, errorEl) {
    errorEl.textContent = input.validationMessage;
    input.classList.add("popup__input_invalid");
    errorEl.classList.add("popup__error_visible");
  }

  function hideInputError(input, errorEl) {
    errorEl.textContent = "";
    input.classList.remove("popup__input_invalid");
    errorEl.classList.remove("popup__error_visible");
  }

  function getOrCreateErrorEl(input) {
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("popup__error")) {
      errorEl = document.createElement("span");
      errorEl.className = "popup__error";
      input.insertAdjacentElement("afterend", errorEl);
    }
    return errorEl;
  }

  function validateInput(input) {
    const errorEl = getOrCreateErrorEl(input);
    if (!input.validity.valid) showInputError(input, errorEl);
    else hideInputError(input, errorEl);
  }

  function updateSubmitState(formEl, submitBtn) {
    if (!submitBtn) return;
    if (typeof window.setSubmitState === "function") {
      window.setSubmitState(formEl, submitBtn);
    } else {
      submitBtn.disabled = !formEl.checkValidity();
    }
  }

  function enableFormValidation(formEl, submitBtn, inputsSelector = "input") {
    if (!formEl) return;
    formEl.setAttribute("novalidate", "");

    const inputs = Array.from(formEl.querySelectorAll(inputsSelector));

    inputs.forEach((input) => {
      // Reserva el espacio del error desde el inicio
      getOrCreateErrorEl(input);

      input.addEventListener("invalid", (e) => {
        e.preventDefault();
        validateInput(input);
      });

      input.addEventListener("input", () => {
        validateInput(input);
        updateSubmitState(formEl, submitBtn);
      });
    });

    formEl.addEventListener("submit", (e) => {
      if (!formEl.checkValidity()) {
        e.preventDefault();
        inputs.forEach(validateInput);
        updateSubmitState(formEl, submitBtn);
      }
    });

    // Estado inicial
    updateSubmitState(formEl, submitBtn);
  }

  /* Wrappers por formulario */

  // Editar perfil
  function enableEditProfileValidation(formEl, submitBtn) {
    enableFormValidation(formEl, submitBtn, "input");
  }

  // Nuevo lugar: asegura atributos y valida título + URL
  function enableNewPlaceValidation(formEl, submitBtn, titleInput, urlInput) {
    if (titleInput) {
      titleInput.setAttribute("required", "");
      titleInput.setAttribute("minlength", "2");
      titleInput.setAttribute("maxlength", "30");
    }
    if (urlInput) {
      urlInput.setAttribute("required", "");
      urlInput.setAttribute("type", "url");
    }
    enableFormValidation(formEl, submitBtn, "input");
  }

  // API pública
  global.Validation = {
    enableEditProfileValidation,
    enableNewPlaceValidation,
  };
})(window);
