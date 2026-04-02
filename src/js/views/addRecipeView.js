import View from "./View";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");

  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }
  closeWindow() {
    this._window.classList.add("hidden");
    this._overlay.classList.add("hidden");
  }
  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const formDataArr = [...new FormData(this)];
      const formDataObj = Object.fromEntries(formDataArr);

      handler(formDataObj);
      // this.toggleWindow();
    });
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.closeWindow.bind(this));
    this._overlay.addEventListener("click", this.closeWindow.bind(this));
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
