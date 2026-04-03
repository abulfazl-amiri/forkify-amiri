import icons from "url:../../img/icons.svg";

/**
 * Base view class with shared render/update helpers for all UI sections.
 */
export default class View {
  _data;

  /**
   * Renders markup into the target element or returns it as a string.
   * @param {Object|Object[]} data
   * @param {boolean} [render=true]
   * @returns {string|void}
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderErrorMessage();
      return;
    }

    this._data = data;
    const recipeMarkup = this._generateMarkup();

    if (!render) return recipeMarkup;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", recipeMarkup);
  }

  /**
   * Patches only changed text and attributes instead of replacing the full view.
   * @param {Object|Object[]} data
   */
  update(data) {
    this._data = data;
    const newRecipeMarkup = this._generateMarkup();
    const newDOM = document
      .createRange()
      .createContextualFragment(newRecipeMarkup);
    const newDOMElements = Array.from(newDOM.querySelectorAll("*"));
    const curDOMElements = Array.from(this._parentEl.querySelectorAll("*"));

    newDOMElements.forEach((newEl, i) => {
      const curEl = curDOMElements[i];
      if (
        !curEl.isEqualNode(newEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // update element textvalue
        curEl.textContent = newEl.textContent;
      }
      if (!curEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach((att) =>
          curEl.setAttribute(att.name, att.value),
        );
      }
    });
  }

  /**
   * Shows the shared loading spinner markup.
   */
  renderSpinner() {
    const spinnerEl = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", spinnerEl);
  }

  /**
   * Shows an error state inside the view.
   * @param {string} [message=this._errorMessage]
   */
  renderErrorMessage(message = this._errorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }

  /**
   * Shows a success or neutral message inside the view.
   * @param {string} [message=this._message]
   */
  renderMessage(message = this._message) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }
}
