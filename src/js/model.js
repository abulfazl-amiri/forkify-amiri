import { async } from "regenerator-runtime";

export const state = {
  recipe: {}
}

export const loadRecipe = async function (id) {
  const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(`[${res.status}] Error: ${data.message}`);

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