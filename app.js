const API_KEY = "ece985488c982715535011849742081f";
const imagePath = "https://image.tmdb.org/t/p/w1280";
const input = document.querySelector(".search input");
const btn = document.querySelector(".search button");
const mainGridTitle = document.querySelector(".favourites h1");
const mainGrid = document.querySelector(".favourites .movies-grid");
const trendingGrid = document.querySelector(".trending .movies-grid");
const popupContainer = document.querySelector(".popup-container");

// Favorites list (initialize as an empty array)
let favoritesList = [];

async function getMovieBySearch(search_term) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
  );
  let respData = await resp.json();

  return respData.results;
}

async function addSearchMoviestoDOM() {
  const search_term = input.value;
  const data = await getMovieBySearch(search_term);
  mainGridTitle.innerText = "Search Results...";
  let resultArr = data.map((m) => {
    return `
    <div class="card" data-id="${m.id}">
            <div class="img">
              <img src="${imagePath + m.poster_path}" alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
              </div>
            </div>
          </div>
    `;
  });
  mainGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}

btn.addEventListener("click", addSearchMoviestoDOM);

function addClickEffectToCards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showPopUp(card);
    });
  });
}

async function getMovieById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
}

async function getMovieTrailerById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results[0].key;
}

async function showPopUp(card) {
  popupContainer.classList.add("show-popup");
  const movieId = card.getAttribute("data-id");
  const movie = await getMovieById(movieId);
  const key = await getMovieTrailerById(movieId);
  console.log(movie);

  popupContainer.style.background = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)),
  url(${imagePath + movie.poster_path})`;
  popupContainer.innerHTML = `
  <span class="x-icon">&#10006;</span>
  <div class="content">
    
    <div class="left">
      <div class="poster-img">
        <img src="${imagePath + movie.poster_path}" alt="" />
      </div>
      <div class="single-info">
        <span>Add to favourites :</span>
        <span class="heart-icon">&#9829;</span>
      </div>
    </div>
    

    
    <div class="right">
      <h1>${movie.title}</h1>
      <h3>${movie.tagline}</h3>
      
      <div class="single-info-container">
        <div class="single-info">
          <span>Languages :</span>
          <span>${movie.spoken_languages[0].name}</span>
        </div>
        <div class="single-info">
          <span>Length :</span>
          <span>${movie.runtime} Minutes</span>
        </div>
        <div class="single-info">
          <span>Rating :</span>
          <span>${movie.vote_average} / 10</span>
        </div>
        <div class="single-info">
          <span>Budget :</span>
          <span>$ ${movie.budget} </span>
        </div>
        <div class="single-info">
          <span>Release Date</span>
          <span>${movie.release_date}</span>
        </div>
      </div>
      

      
      <div class="genres">
        <h2>Genres</h2>
        <ul>
          ${movie.genres
            .map((e) => {
              return `<li>${e.name}</li>`;
            })
            .join("")}
        </ul>
      </div>
      

      
      <div class="overview">
        <h2>Overview</h2>
        <p>
          ${movie.overview}
        </p>
      </div>
      

      
      <div class="trailer">
        <h2>Trailer</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
     
    </div>
   
  </div>
  `;

  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () => {
    popupContainer.classList.remove("show-popup");
  });

  const heart_icon = document.querySelector(".heart-icon");
  // Check if the movie is already in favorites
  const isFavorite = favoritesList.some((favMovie) => favMovie.id == movieId);
  if (isFavorite) {
    heart_icon.classList.add("change-color");
  }

  heart_icon.addEventListener("click", () => {
    if (heart_icon.classList.contains("change-color")) {
      heart_icon.classList.remove("change-color");
      removeFromFavorites(movieId); // Remove from favorites
    } else {
      heart_icon.classList.add("change-color");
      addToFavorites(movie); // Add to favorites
    }
  });
}


function addToFavorites(movie) {
  // Add movie to favorites list
  favoritesList.push(movie);
  // Update favorites grid
  updateFavoritesGrid();
  // Update local storage
  updateLocalStorage();
}

function removeFromFavorites(movieId) {
  // Remove movie from favorites list
  favoritesList = favoritesList.filter((movie) => movie.id != movieId);
  // Update favorites grid
  updateFavoritesGrid();
  // Update local storage
  updateLocalStorage();
}


function updateLocalStorage() {
  // Store favorites list in local storage
  localStorage.setItem('favorites', JSON.stringify(favoritesList));
}

function getFavoritesFromLocalStorage() {
  // Retrieve favorites list from local storage
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}
function updateFavoritesGrid() {
  mainGridTitle.innerText = "My Favourite Movies";
  let resultArr = favoritesList.map((m) => {
    return `
    <div class="card" data-id="${m.id}">
            <div class="img">
              <img src="${imagePath + m.poster_path}" alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
              </div>
            </div>
          </div>
    `;
  });
  mainGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}
async function getTrendingMovies() {
  try {
    const resp = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
    );
    if (!resp.ok) {
      throw new Error('Failed to fetch trending movies');
    }
    let respData = await resp.json();
    return respData.results;
  } catch (error) {
    console.error('Fetch error:', error.message);
   
    return []; // Return an empty array as a fallback
  }
}

async function addTrendingMoviestoDOM() {
  const data = await getTrendingMovies();
  const displayMovies = data.slice(0, 5);
  //console.log(displayMovies);
  let resultArr = displayMovies.map((m) => {
    return `
    <div class="card" data-id="${m.id}">
            <div class="img">
              <img src="${imagePath + m.poster_path}" alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
              </div>
            </div>
          </div>
    `;
  });
  trendingGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
  favoritesList = getFavoritesFromLocalStorage();
// Update favorites grid

updateFavoritesGrid();
}

addTrendingMoviestoDOM();

