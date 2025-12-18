// scripts/utils.js

export function openPopup(popupEl) {
  if (!popupEl) return;
  popupEl.classList.add("popup_opened");
  document.addEventListener("keydown", handleEsc);
  popupEl.addEventListener("mousedown", handleOverlay);
}

export function closePopup(popupEl) {
  if (!popupEl) return;
  popupEl.classList.remove("popup_opened");
  popupEl.removeEventListener("mousedown", handleOverlay);

  const anyOpened = document.querySelector(".popup_opened");
  if (!anyOpened) {
    document.removeEventListener("keydown", handleEsc);
  }
}

function handleEsc(e) {
  if (e.key === "Escape") {
    const openedPopups = document.querySelectorAll(".popup_opened");
    openedPopups.forEach((popup) => closePopup(popup));
  }
}

function handleOverlay(e) {
  if (e.target.classList.contains("popup")) {
    closePopup(e.currentTarget);
  }
}
