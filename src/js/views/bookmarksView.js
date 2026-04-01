import View from "./View";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmark yet. find a nice recipe and book mark it.";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}
export default new BookmarksView();
