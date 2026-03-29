
// polyfilling 
import "core-js/stable";
import "regenerator-runtime/runtime";


import * as model from "./model.js"
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js"

// https://forkify-api.jonas.io

const recipeContainer = document.querySelector('.recipe');


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // displaying loading spinner
    recipeView.renderSpinner();

    // loading
    await model.loadRecipe(id);
    // render the recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderErrorMessage();
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
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
}


const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSeachResults);
};

init();
