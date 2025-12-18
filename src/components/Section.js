// scripts/Section.js

export class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    // Para que al usar prepend() no se invierta el orden inicial
    this._items
      .slice()
      .reverse()
      .forEach((item) => {
        this._renderer(item);
      });
  }

  addItem(element) {
    this._container.prepend(element);
  }
}
