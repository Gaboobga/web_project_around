// components/UserInfo.js
export class UserInfo {
  constructor({ nameSelector, jobSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
  }

  _getTextNode(element) {
    const nodes = Array.from(element.childNodes);
    const textNode = nodes.find(
      (node) =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
    );

    if (!textNode) {
      const newNode = document.createTextNode("");
      element.insertBefore(newNode, element.firstChild);
      return newNode;
    }

    return textNode;
  }

  getUserInfo() {
    const nameTextNode = this._getTextNode(this._nameElement);

    return {
      name: nameTextNode.textContent.trim(),
      job: this._jobElement.textContent.trim(),
    };
  }

  setUserInfo({ name, job }) {
    const nameTextNode = this._getTextNode(this._nameElement);

    nameTextNode.textContent = `${name}\n          `;

    this._jobElement.textContent = job;
  }
}
