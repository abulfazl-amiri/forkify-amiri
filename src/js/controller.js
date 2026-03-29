
// polyfilling 
import "core-js/stable";
import "regenerator-runtime/runtime";


import * as model from "./model.js"
import recipeView from "./views/recipeView.js";

// https://forkify-api.jonas.io

const recipeContainer = document.querySelector('.recipe');


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // loading spinner
    recipeView.renderSpinner();

    //// loading
    await model.loadRecipe(id);
    recipeView.render(model.state);

  } catch (err) {
    recipeView.renderErrorMessage();
  }
};
const controlSeachResults = async function () {
  try {
    await model.loadSearchResults("pizza");
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
}


const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
