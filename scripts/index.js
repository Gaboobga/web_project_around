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
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg",
  },
];

/* Selectores base */
const cardsContainer = document.querySelector(".cards");

/* Perfil */
const profileNameEl = document.querySelector(".profile__name");
const profileAboutEl = document.querySelector(".profile__occupation");
const editProfileBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");

/* Popups */
const popupEdit =
  document.querySelector(".popup_type_edit-profile") ||
  document.querySelector(".popup"); // fallback
const popupAdd = document.querySelector(".popup_type_add-card");
const popupImage = document.querySelector(".popup_type_image");

/* Popup Editar perfil: elementos */
const formEdit = popupEdit?.querySelector('form[name="edit-profile"]');
const nameInput = formEdit?.elements?.name;
const aboutInput = formEdit?.elements?.about;
const saveEditBtn = formEdit?.querySelector(".popup__save-button");

/* Popup Añadir tarjeta: elementos */
const formAdd = popupAdd?.querySelector('form[name="add-card"]');
const titleInput = formAdd?.elements?.title;
const linkInput = formAdd?.elements?.link;
const saveAddBtn = formAdd?.querySelector(".popup__save-button");

/* Popup Imagen: elementos */
const popupImgEl = popupImage?.querySelector(".popup__image");
const popupCaptionEl = popupImage?.querySelector(".popup__caption");

/* Template tarjeta */
const cardTemplate = document.querySelector("#card-template");

/* Utilidades de popups */
function openPopup(popupEl) {
  if (!popupEl) return;
  popupEl.classList.add("popup_opened");
  document.addEventListener("keydown", handleEsc);
  popupEl.addEventListener("mousedown", handleOverlay);
}

function closePopup(popupEl) {
  if (!popupEl) return;
  popupEl.classList.remove("popup_opened");
  popupEl.removeEventListener("mousedown", handleOverlay);
  if (!document.querySelector(".popup_opened")) {
    document.removeEventListener("keydown", handleEsc);
  }
}

function handleEsc(e) {
  if (e.key === "Escape") {
    const opened = document.querySelectorAll(".popup_opened");
    opened.forEach(closePopup);
  }
}

function handleOverlay(e) {
  if (e.target.classList.contains("popup")) {
    closePopup(e.currentTarget);
  }
}

/* Validación para habilitar botones */
function setSubmitState(formEl, buttonEl) {
  if (!formEl || !buttonEl) return;
  const allValid = Array.from(formEl.elements).every((el) => {
    if (!(el instanceof HTMLInputElement)) return true;
    return el.validity.valid;
  });
  buttonEl.disabled = !allValid;
}

/* Tarjetas */
function createCard({ name, link }) {
  let card;

  if (cardTemplate) {
    const node = cardTemplate.content.querySelector(".card").cloneNode(true);
    card = node;
  } else {
    card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="card__image" src="" alt="" />
      <button class="card__delete-button" type="button" aria-label="Eliminar tarjeta"></button>
      <div class="card__caption">
        <h3 class="card__title block"></h3>
        <button class="card__like-button" type="button" aria-label="Marcar como favorito"></button>
      </div>
    `;
  }

  const img = card.querySelector(".card__image");
  const title = card.querySelector(".card__title");
  const likeBtn = card.querySelector(".card__like-button");
  const delBtn = card.querySelector(".card__delete-button");

  img.src = link;
  img.alt = name;
  title.textContent = name;

  // Like (toggle)
  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("card__like-button_active");
  });

  // Eliminar tarjeta
  delBtn.addEventListener("click", () => {
    card.remove();
  });

  // Abrir imagen
  img.addEventListener("click", () => {
    if (!popupImage) return;
    if (popupImgEl) popupImgEl.src = link;
    if (popupImgEl) popupImgEl.alt = name;
    if (popupCaptionEl) popupCaptionEl.textContent = name;
    openPopup(popupImage);
  });

  return card;
}

function renderInitialCards() {
  if (!cardsContainer) return;
  initialCards.forEach((item) => {
    cardsContainer.append(createCard(item));
  });
}

/* Eventos: Editar perfil */
if (editProfileBtn && popupEdit && formEdit) {
  editProfileBtn.addEventListener("click", () => {
    const currentNameText =
      profileNameEl?.childNodes?.[0]?.nodeValue?.trim() ||
      profileNameEl?.textContent?.trim() ||
      "";
    if (nameInput) nameInput.value = currentNameText;
    if (aboutInput)
      aboutInput.value = profileAboutEl?.textContent?.trim() || "";

    setSubmitState(formEdit, saveEditBtn);
    openPopup(popupEdit);
  });

  formEdit.addEventListener("input", () =>
    setSubmitState(formEdit, saveEditBtn)
  );

  formEdit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (profileNameEl && nameInput) {
      // Si el nombre tiene un botón dentro, preservamos el botón
      const btn = profileNameEl.querySelector(".profile__edit-button");
      profileNameEl.textContent = `${nameInput.value}`;
      if (btn) profileNameEl.appendChild(btn);
    }
    if (profileAboutEl && aboutInput) {
      profileAboutEl.textContent = aboutInput.value;
    }
    closePopup(popupEdit);
  });
}

/* Cerrar popups con botones */
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".popup__close-button");
  if (closeBtn) {
    const popup = closeBtn.closest(".popup");
    if (popup) closePopup(popup);
  }
});

/* Eventos: Añadir tarjeta */
if (addCardBtn && popupAdd && formAdd) {
  addCardBtn.addEventListener("click", () => {
    formAdd.reset();
    setSubmitState(formAdd, saveAddBtn);
    openPopup(popupAdd);
  });

  formAdd.addEventListener("input", () => setSubmitState(formAdd, saveAddBtn));

  formAdd.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput?.value?.trim();
    const link = linkInput?.value?.trim();
    if (!title || !link) return;

    const card = createCard({ name: title, link });
    cardsContainer.prepend(card);
    closePopup(popupAdd);
    formAdd.reset();
    setSubmitState(formAdd, saveAddBtn);
  });
}

/* Render inicial */
renderInitialCards();
