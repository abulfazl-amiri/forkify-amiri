import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: {}
}

export const loadRecipe = async function (id) {
  const data = await getJSON(`${API_URL}/${id}`);

  // buidling the objc 
  const { recipe } = data.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,

    publisher: recipe.publisher,
    imgUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
  }

  // loging the obj
  console.log(recipe);
}