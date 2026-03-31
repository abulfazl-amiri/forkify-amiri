
// polyfilling 
import "core-js/stable";
import "regenerator-runtime/runtime";


import * as model from "./model.js"
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js"
import paginationView from "./views/paginationView.js"

// https://forkify-api.jonas.io

const recipeContainer = document.querySelector('.recipe');

if(module.hot){
  module.hot.accept();
}

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  // render spinner 
  recipeView.renderSpinner();

  // load data
  try {
    await model.loadRecipe(id);
  } catch (err) {
    console.error("Recipe request failed:", err);
    recipeView.renderErrorMessage();
    return;
  }
  // render data 
  try {
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error("Recipe render failed:", err);
    recipeView.renderErrorMessage(
      "Recipe data loaded, but rendering failed. Check the console for the exact error."
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
}

const controlPagination = function (goToPage){
    // render search results 
    resultsView.render(model.getSearchResultPage(goToPage));
    
    // paginate the results
    paginationView.render(model.state.search);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSeachResults);
  searchView.focusSearchInput();
  paginationView.addHandlerClick(controlPagination);
};

init();
