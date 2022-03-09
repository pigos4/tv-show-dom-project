const searchBar = document.getElementById("searchBar");
const movieCatalogue = document.getElementById("movieCatalogue");
const selectMoviesElement = document.getElementById("selectMovies");
const selectShows = document.getElementById("selectShows");
const amountResult = document.getElementById("amountResult");
const searchShows = document.getElementById("searchShows");
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
  selectMoviesElement.style.display = "flex";
  searchBar.style.display = "flex";
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

const fetchShow = (url) => {
  fetch(url).then((res) => {
    res.json().then((data) => {
      movieCatalogueData.set(data);
    });
  });
};

// window.onload = function () {
  
// };

const showsListData = {
  mc: [],
  set(mc) {
    this.showsList = mc;
  },
  get() {
    return this.showsList;
  },
};
function readMoreReadLess(dots, moreText, btnText) {
  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    moreText.style.display = "inline";
  }
}

const renderShows = (arrayOfShows) => {
  clearChildren(movieCatalogue);
  arrayOfShows.forEach(
    ({ name, image, summary, genres, status, rating, runtime, id }) => {
      const divContainer = document.createElement("div");
      const h2NameTitle = document.createElement("h2");
      const pSummary = document.createElement("p");
      const img = document.createElement("img");
      const unorderedList = document.createElement("ul");
      const liGenres = document.createElement("li");
      const liStatus = document.createElement("li");
      const liRating = document.createElement("li");
      const liRuntime = document.createElement("li");
      const buttonReadMore = document.createElement("button");
      const spanDots = document.createElement("span");
      const spanMoreText = document.createElement("span");
      spanMoreText.id = `more${id}`;
      pSummary.innerHTML = summary.substring(100, summary.length - 4);
divContainer.className = "textStyle";
      spanDots.id = `dot${id}`;
      spanDots.innerText = "...";
      spanDots.style.display = "inline";

      buttonReadMore.id = "btnReadMore";
      buttonReadMore.innerText = "Read More";
      buttonReadMore.style.display = "inline";

      divContainer.classList.add("singleMovie");
      divContainer.style.border = "0.2vw rgb(82, 80, 80) solid";
      h2NameTitle.innerText = name;
      img.src = image.medium;

      spanMoreText.innerHTML = summary
        .replace(/<p>|<\/p>/g, "")
        .substring(0, 100);
      pSummary.style.display = "none";
      liGenres.innerText = `Genres: ${genres.join(', ')}`;
      liStatus.innerText = `Status: ${status}`;
      liRating.innerText = `Rating average: ${rating.average}`;
      liRuntime.innerText = `Runtime :${runtime}`;

      divContainer.append(
        h2NameTitle,
        img,
        spanMoreText,
        pSummary,
        spanDots,
        buttonReadMore,
        unorderedList,
        liGenres,
        liStatus,
        liRating,
        liRuntime
      );
      movieCatalogue.appendChild(divContainer);
      divContainer.value = id;
      buttonReadMore.addEventListener("click", () => {
        readMoreReadLess(spanDots, pSummary, buttonReadMore);
        console.log(summary);
      });
      img.addEventListener("click", () => {
        searchShows.value = "";
        clearChildren(selectMoviesElement);
        fetchShow(
          `https://api.tvmaze.com/shows/${divContainer.value}/episodes`
        );
        movieCataloguePublisher.unsubscribe(renderShows);
      });
    }
  );
};

(function fetchDataShows() {
  const url = "https://api.tvmaze.com/shows";
  fetch(url).then((res) => {
    res.json().then((data) => {
      showsListData.set(data.sort((a, b) => a.name.localeCompare(b.name)));

      renderShows(showsListData.get());
    });
  });
})();

searchShows.addEventListener("input", (e) => {
  selectMoviesElement.style.display = "none";
  searchBar.style.display = "none";
  const showsFiltered = showsListData
    .get()
    .filter(({ name, genres, summary }) => {
      return (
        name.toLowerCase().includes(e.target.value) ||
        genres
          .map((v) => v.toLowerCase())
          .includes(e.target.value.toLowerCase()) ||
        summary.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });

  renderShows(showsFiltered);
  amountResult.innerText = `(${showsFiltered.length}/${
    showsListData.get().length
  })`;

  showsFiltered;
});
