const searchBar = document.getElementById("searchBar");
const movieCatalogue = document.getElementById("movieCatalogue");
const selectMoviesElement = document.getElementById("selectMovies");
const selectShows = document.getElementById("selectShows");
const amountResult = document.getElementById("amountResult");
// Utils
const formatNumbers = (num) => (num < 10 ? `0${num}` : num.toString());

const formatTitle = ({ name, season, number }, seasonFirst) =>
  !seasonFirst
    ? `${name} S${formatNumbers(season)}E${formatNumbers(number)}`
    : `S${formatNumbers(season)}E${formatNumbers(number)} - ${name} `;

const clearChildren = (node, onlyOne) => {
  if (onlyOne) {
    node.removeChild(node.lastChild);
  } else {
    while (node.firstChild) {
      node.removeChild(node.lastChild);
    }
  }
};

const movieCataloguePublisher = MovieCataloguePublisher();

const movieCatalogueData = {
  mc: [],
  set(mc) {
    this.movieCatalogue = mc;
    searchBar.value = "";
    selectMoviesElement.value = "";
    movieCataloguePublisher.inputChange();
  },
  get() {
    return this.movieCatalogue;
  },
};

(function fetchDataShows() {
  const url = "https://api.tvmaze.com/shows";
  fetch(url).then((res) => {
    res.json().then((data) => {
      data
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(({ id, url, name }) => {
          const option = document.createElement("option");
          option.text = name;
          option.value = id;
          selectShows.add(option);
        });
    });
  });
})();

selectShows.addEventListener("change", (e) => {
  clearChildren(selectMoviesElement);
  movieCataloguePublisher.subscribe(selectMovies);
  e.target.value
    ? fetchShow(`https://api.tvmaze.com/shows/${e.target.value}/episodes`)
    : fetchShow();
});

function MovieCataloguePublisher() {
  let subscribers = [];

  function subscribe(fn) {
    subscribers.push(fn);
  }
  function unsubscribe(fn) {
    subscribers = subscribers.filter((sub) => sub !== fn);
  }
  function inputChange(idInput, text) {
    let filteredEpisodes = movieCatalogueData.get();
    if (text) {
      filteredEpisodes = movieCatalogueData
        .get()
        .filter(({ name, summary, season, number }) => {
          return (
            formatTitle({ name, season, number })
              .toLowerCase()
              .includes(text.toLowerCase()) ||
            summary.toLowerCase().includes(text.toLowerCase())
          );
        });
    } else if (idInput) {
      filteredEpisodes = movieCatalogueData
        .get()
        .filter(({ id }) => id.toString() === idInput);
    }
    subscribers.forEach((fn) => {
      fn(filteredEpisodes);
    });
  }
  return { subscribe, inputChange, unsubscribe };
}

function selectMovies() {
  clearChildren(selectMoviesElement);
  const optionShowAll = document.createElement("option");
  optionShowAll.text = "Show all movies";
  optionShowAll.value = "";
  selectMoviesElement.add(optionShowAll);
  movieCatalogueData.get().forEach(({ id, name, season, number }, i) => {
    const option = document.createElement("option");
    option.text = `${formatTitle({ name, season, number }, true)}`;
    option.value = id;
    selectMoviesElement.add(option);
  });
}
movieCataloguePublisher.subscribe(selectMovies);

selectMoviesElement.addEventListener("change", (e) => {
  movieCataloguePublisher.unsubscribe(selectMovies);
  movieCataloguePublisher.inputChange(e.target.value);
});

//Creating config search bar
searchBar.addEventListener("input", (e) => {
  movieCataloguePublisher.inputChange("", e.target.value);
});

const renderMovies = (arrOfMovies) => {
  clearChildren(movieCatalogue);
  return arrOfMovies.map((e) => {
    const divContainer = document.createElement("div");
    const pName = document.createElement("p");
    const pSummary = document.createElement("p");
    const img = document.createElement("img");
    divContainer.classList.add("singleMovie");
    const { image, summary } = (movie = e);
    pName.innerText = formatTitle(movie);
    img.src = image.medium;
    pSummary.innerText = summary.replace(/<p>|<\/p>/g, "");
    divContainer.append(pName, img, pSummary);
    movieCatalogue.appendChild(divContainer);
  });
};
movieCataloguePublisher.subscribe(renderMovies);
function renderAmountMovies(arrOfIndexToRender) {
  amountResult.innerText = `(${arrOfIndexToRender.length}/${
    movieCatalogueData.get().length
  })`;
}
movieCataloguePublisher.subscribe(renderAmountMovies);

const fetchShow = (url = "https://api.tvmaze.com/shows/82/episodes") => {
  fetch(url).then((res) => {
    res.json().then((data) => {
      movieCatalogueData.set(data);
    });
  });
};

window.onload = function () {
  fetchShow();
};
