import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//imports for parcel
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0 update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    // 1 Rendering bookmarks
    bookmarksView.update(model.state.bookmarks);
    // 2 Loading recipe
    await model.loadRecipe(id);
    // 3 rendering recipe
    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //2 Load Search results
    await model.loadSearchResults(query);

    //3) Render results
    resultsView.render(model.getSearchResultsPage(1));
    //we here passed 1 to make sure every time we rendring new search result the state.search.page value become 1
    // 4) Render Initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //3) Render results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render Initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings inthe state

  model.updateServings(newServings);
  recipeView.update(model.state.recipe);

  //update the recipe view
};

const controlAddBookmark = function () {
  // 1 add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 update the bookmark
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render the spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);
    //Render the recipe
    recipeView.render(model.state.recipe);

    //Render success message
    addRecipeView.renderMessage();

    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change Id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome to application !');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
// window.addEventListener('hashchange', controlRecipes);
