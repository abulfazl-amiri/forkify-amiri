import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
  }
}

export const loadRecipe = async function (id) {
  try {
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
  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const json = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = json.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imgUrl: rec.image_url,
      };
    });
    console.log(json);
  } catch (err) {
    throw err;
  }
}