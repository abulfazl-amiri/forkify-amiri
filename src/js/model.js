import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config.js";
import { AJAX } from "./helpers.js";

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

const createRecipeObject = function (data) {
  // buidling the objc
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,

    publisher: recipe.publisher,
    imgUrl: recipe.image_url,
    sourceUrl: recipe.source_url,

    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);

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
    const json = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = json.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imgUrl: rec.image_url,

        ...(rec.key && { key: rec.key }),
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

  state.recipe.servings = newServings;
};

const presistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookMarks));
};

export const addToBookmarks = function (recipe) {
  // check if already bookmarked
  if (state.bookMarks.some((bookmark) => recipe.id === bookmark.id)) return;

  // add to book mark
  state.bookMarks.push(recipe);

  // mark as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

export const removeFromBookmarks = function (id) {
  const index = state.bookMarks.findIndex((bookmark) => bookmark.id === id);
  if (index === -1) return;
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

export const clearBookMarks = function () {
  localStorage.clear("bookmarks");
};

// clearBookMarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format, please use the corrent format",
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,

      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
    };

    // response data
    const apiResponseData = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(apiResponseData);
    addToBookmarks(state.recipe);

    console.log("data to send", recipe);
    console.log("api response", apiResponseData);
  } catch (err) {
    throw err;
  }
};
