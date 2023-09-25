const API_KEY = "36729fb4-6863-4b21-b360-488788b8721c";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return 'green';
    } else if (vote > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    //Очищаем предыдущие фильмы
    document.querySelector(".movies").innerHTML = "";

    data.films.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
                <div class="movie-cover-inner">
                <img 
                  src="${movie.posterUrlPreview}"
                  class="movie-cover" 
                  alt="${movie.nameRu}"
                />
                <div class="movie-cover-darknened"></div>
                </div>
                <div class="movie-info">
                <div class="movie-title">${movie.nameRu}</div>
                <div class="movie-category">${movie.genres.map(
                  genre => ` ${genre.genre}`
                )}</div>
                ${
                  movie.rating &&
                `
                <div class="movie-average movie-average-${getClassByRate(movie.rating)}">${movie.rating}
                </div>
                `}
                </div>
                `;
    movieEl.addEventListener("click", () => openModal(movie.filmId))
    moviesEl.appendChild(movieEl)

    });
}

const form = document.querySelector("form");
const search = document.querySelector(".header-search");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);

        search.value = "";
    }
});

//modal

// Modal
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  
  modalEl.classList.add("modal-show");
  document.body.classList.add("stop-scrolling");
  
  modalEl.innerHTML = `
  <div class="modal-card">
    <img class="modal-movie-backdrop" src="${respData.posterUrl}" alt="">
    <h2>
      <span class="modal-movie-title">${respData.nameRu}</span>
      <span class="modal-movie-release-year"> - ${respData.year}</span>
    </h2>
    <ul class="modal-movie-info">
      <div class="loader"></div>
      <li class="modal-movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}
      </li>
      ${respData.filmLength ? `
      <li class="modal-movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
      <li >Сайт: <a class="modal-movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
      <li class="modal-movie-overview">Описание - ${respData.description}</li>
    </ul>
    <button type="button" class="modal-button-close">Закрыть</button>
  </div>
`
const btnClose = document.querySelector(".modal-button-close");
btnClose.addEventListener("click", () => closeModal());
}

function closeModal () {
modalEl.classList.remove("modal-show");
document.body.classList.remove("stop-scrolling")
}

window.addEventListener("click", (e) => {
    console.log(e.target)
    if(e.target === modalEl) {
        closeModal();
    }
}) //навешиваем обработчик на все окно, принимается (e) event.

window.addEventListener("keydown", (e) => {
    if(e.keyCode === 27) {
        closeModal();
    }
}) //навешиваем обработчик на кнопку esc.



 