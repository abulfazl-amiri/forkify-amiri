import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    currentPage: 1,
  },
  bookMarks: [],
};

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
    };

    // check wether the recipe that is loaded is in bookmark list
    // if yes -> bookmark = true
    // else -> bookmark = false
    if (state.bookMarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    // loging the obj
    // console.log(recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const json = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = json.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imgUrl: rec.image_url,
      };
    });
    state.search.currentPage = 1;
    // console.log(json);
  } catch (err) {
    throw err;
  }
};
export const getSearchResultPage = function (
  pageNum = state.search.currentPage,
) {
  if (pageNum <= 0) return;
  state.search.currentPage = pageNum;

  const start = (pageNum - 1) * state.search.resultsPerPage;
  const end = pageNum * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    // newQuantity = oldQuantity * newServings / numOldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  debugger;
  state.recipe.servings = newServings;
};

const presistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookMarks));
};

export const addToBookmarks = function (recipe) {
  // add to book mark
  state.bookMarks.push(recipe);

  // mark as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

export const removeFromBookmarks = function (id) {
  const index = state.bookMarks.findIndex((bookmark) => bookmark.id === id);
  state.bookMarks.splice(index, 1);

  // mark as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();

const clearBookMarks = function () {
  localStorage.clear("bookmarks");
};
