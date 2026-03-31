import View from "./View.js";

class SearchView extends View {
  #parentEl = document.querySelector(".search");

  getQuery() {
    const query = this.#parentEl.querySelector(".search__field").value.trim();
    this.#clearSearchField();
    return query;
  }               
  #clearSearchField() {
    this.#parentEl.querySelector(".search__field").value = "";
  }
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    })
  }
  focusSearchInput(){
    this.#parentEl.querySelector(".search__field").focus();
  }

}
export default new SearchView();