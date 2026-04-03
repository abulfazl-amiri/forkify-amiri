/**
 * Polyfills keep newer JS features working in older browsers.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import { MODAL_CLOSE_DELAY_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// https://forkify-api.jonas.io

// const recipeContainer = document.querySelector(".recipe");

// if (module.hot) {
//   module.hot.accept();
// }

/**
 * Loads the active recipe from the URL hash and updates related UI state.
 * @returns {Promise<void>}
 */
const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;

  recipeView.renderSpinner();

  resultsView.update(model.getSearchResultPage());
  bookmarksView.update(model.state.bookMarks);

  try {
    await model.loadRecipe(id);
  } catch (err) {
    console.error("Recipe req uest failed:", err);
    recipeView.renderErrorMessage();
    return;
  }
  try {
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error("Recipe render failed:", err);
    recipeView.renderErrorMessage(
      "Recipe data loaded, but rendering failed. Check the console for the exact error.",
    );
  }
};

/**
 * Handles search submission, result rendering, and pagination setup.
 * @returns {Promise<void>}
 */
const controlSeachResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Renders the selected search result page.
 * @param {number} goToPage
 */
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

/**
 * Updates servings in state and patches the current recipe view.
 * @param {number} newServings
 */
const controlServings = function (newServings) {
  model.updateServings(newServings);

  try {
    recipeView.update(model.state.recipe);
  } catch (err) {
    console.error("Recipe render failed:", err);
    recipeView.renderErrorMessage(
      "Recipe data loaded, but rendering failed. Check the console for the exact error.",
    );
  }
};

/**
 * Toggles bookmark state for the current recipe and refreshes bookmark UI.
 */
const controlAddToBookmarks = function () {
  model.state.recipe.bookmarked
    ? model.removeFromBookmarks(model.state.recipe.id)
    : model.addToBookmarks(model.state.recipe);

  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

/**
 * Uploads a new recipe, renders it, and closes the form after success.
 * @param {Object} newRecipe
 * @returns {Promise<void>}
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    bookmarksView.render(model.state.bookMarks);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.closeWindow();
    }, MODAL_CLOSE_DELAY_SEC * 1000);

    console.log(model.state.recipe);
  } catch (err) {
    console.log(err);
    addRecipeView.renderErrorMessage(err);
  }
};

/**
 * Wires view events to their controller handlers during app startup.
 */
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
