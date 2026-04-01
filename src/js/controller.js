// polyfilling
import "core-js/stable";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// https://forkify-api.jonas.io

const recipeContainer = document.querySelector(".recipe");

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  // render spinner
  recipeView.renderSpinner();

  // update results view to mark selected from the id in url
  resultsView.update(model.getSearchResultPage());

  // update bookmarks on each recipe load
  bookmarksView.update(model.state.bookMarks);

  // load data
  try {
    await model.loadRecipe(id);
  } catch (err) {
    console.error("Recipe req uest failed:", err);
    recipeView.renderErrorMessage();
    return;
  }
  // render data
  try {
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error("Recipe render failed:", err);
    recipeView.renderErrorMessage(
      "Recipe data loaded, but rendering failed. Check the console for the exact error.",
    );
  }
};
const controlSeachResults = async function () {
  try {
    resultsView.renderSpinner();
    // getting the query
    const query = searchView.getQuery();
    if (!query) return;

    // search && load data for it
    await model.loadSearchResults(query);

    // render search results
    resultsView.render(model.getSearchResultPage());

    // paginate the results
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // render search results
  resultsView.render(model.getSearchResultPage(goToPage));

  // paginate the results
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // update servings in state
  model.updateServings(newServings);

  // re-render data
  try {
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
  } catch (err) {
    console.error("Recipe render failed:", err);
    recipeView.renderErrorMessage(
      "Recipe data loaded, but rendering failed. Check the console for the exact error.",
    );
  }
};

const controlAddToBookmarks = function () {
  model.state.recipe.bookmarked
    ? model.removeFromBookmarks(model.state.recipe.id)
    : model.addToBookmarks(model.state.recipe);

  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // render all bookmarks into bookmark view
  bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddToBookmarks);

  searchView.addHandlerSearch(controlSeachResults);
  searchView.focusSearchInput();

  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
