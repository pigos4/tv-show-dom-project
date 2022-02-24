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
    console.log(mc);
    this.movieCatalogue = mc;
    searchBar.value = "";
    selectMoviesElement.value = "";
    movieCataloguePublisher.inputChange();
  },
  get() {
    return this.movieCatalogue;
  },
};

function MovieCataloguePublisher() {
  let subscribers = [];

  function subscribe(fn) {
    subscribers.push(fn);
  }
  function unsubscribe(fn) {
    subscribers = subscribers.filter((sub) => sub !== fn);
  }
  function inputChange(input) {
    let filteredEpisodes = movieCatalogueData.get();
    if (input) {
      filteredEpisodes = movieCatalogueData
        .get()
        .filter(({ name, summary, season, number }) => {
          return (
            formatTitle({ name, season, number })
              .toLowerCase()
              .includes(input.toLowerCase()) ||
            summary.toLowerCase().includes(input.toLowerCase())
          );
        });
    }
    subscribers.forEach((fn) => {
      fn(filteredEpisodes);
    });
  }
  return { subscribe, inputChange, unsubscribe };
}

const movieCatalogue = document.getElementById("movieCatalogue");
// Creating select movies
const selectMoviesElement = document.getElementById("selectMovies");

function selectMovies() {
  movieCatalogueData.get().forEach(({ name, season, number }, i) => {
    const option = document.createElement("option");
    option.text = `${formatTitle({ name, season, number }, true)}`;
    option.value = name;
    selectMoviesElement.add(option);
  });
}

function clearSelect() {
  selectMoviesElement.value = "";
}
selectMoviesElement.addEventListener("change", (e) => {
  console.log(e.target.value);
  movieCataloguePublisher.inputChange(e.target.value);
});

//Creating config search bar
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("input", (e) => {
  clearSelect();
  movieCataloguePublisher.inputChange(e.target.value);
});

const amountResult = document.getElementById("amountResult");

const renderMovies = (arrOfObjects) => {
  clearChildren(movieCatalogue);
  return arrOfObjects.map((e) => {
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
window.onload = function () {
  movieCatalogueData.set(getAllEpisodes());
  selectMovies();
};
