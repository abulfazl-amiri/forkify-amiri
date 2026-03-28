
// polyfilling 
import "core-js/stable";
import "regenerator-runtime/runtime";


import * as model from "./model.js"
import recipeView from "./views/recipeView.js";

const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

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
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
