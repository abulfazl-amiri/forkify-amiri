import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config.js";
import { AJAX } from "./helpers.js";

/**
 * Central app state shared between the controller and all views.
 */
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

/**
 * Maps the API response shape to the structure used across the app.
 * @param {Object} data
 * @returns {Object}
 */
const createRecipeObject = function (data) {
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

/**
 * Loads one recipe by id and syncs its bookmark status with local state.
 * @param {string} id
 * @returns {Promise<void>}
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);

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

/**
 * Fetches search results and stores the normalized list in state.
 * @param {string} query
 * @returns {Promise<void>}
 */
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

/**
 * Returns only the search results needed for the requested page.
 * @param {number} [pageNum=state.search.currentPage]
 * @returns {Object[]|undefined}
 */
export const getSearchResultPage = function (
  pageNum = state.search.currentPage,
) {
  if (pageNum <= 0) return;
  state.search.currentPage = pageNum;

  const start = (pageNum - 1) * state.search.resultsPerPage;
  const end = pageNum * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Recalculates ingredient quantities when servings change.
 * @param {number} newServings
 */
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

/**
 * Saves a recipe to bookmarks if it is not already there.
 * @param {Object} recipe
 */
export const addToBookmarks = function (recipe) {
  // check if already bookmarked
  if (state.bookMarks.some((bookmark) => recipe.id === bookmark.id)) return;

  // add to book mark
  state.bookMarks.push(recipe);

  // mark as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

/**
 * Removes a recipe from bookmarks by id.
 * @param {string} id
 */
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

/**
 * Parses the upload form data, sends it to the API, and stores the new recipe.
 * Ingredient fields must use the format "quantity,unit,description".
 * @param {Object} newRecipe
 * @returns {Promise<void>}
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
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
