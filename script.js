const allEpisodes = getAllEpisodes();
const rootElem = document.getElementById("root");

const formatNumbers = (num) => (num < 10 ? `0${num}` : num.toString());
const formatTitle = ({ name, season, number }) =>
  `${name} S${formatNumbers(season)}E${formatNumbers(number)}`;

function render(arrOfIndexToRender) {
  arrOfIndexToRender.forEach((e) => {
    const divContainer = document.createElement("div");
    const pName = document.createElement("p");
    const pSummary = document.createElement("p");
    const img = document.createElement("img");
    divContainer.classList.add("singleMovie");
    const { image, summary } = (movie = allEpisodes[e]);

    pName.innerText = formatTitle(movie);
    img.src = image.medium;
    pSummary.innerHTML = summary;
    rootElem.appendChild(divContainer);
    divContainer.append(pName, img, pSummary);
  });
}
const clearChildren = () => {
  while (rootElem.firstChild) {
    rootElem.removeChild(rootElem.lastChild);
  }
};
render(allEpisodes.map((v, i) => i));

render([1, 2, 3]);
