const allEpisodes = getAllEpisodes();
const rootElem = document.getElementById("root");

function render(arrOfIndexToRender) {
  arrOfIndexToRender.forEach((e) => {
    
    const divContainer = document.createElement("div");
    const pName = document.createElement("p");
    const pSummary = document.createElement("p");
    const img = document.createElement("img");
divContainer.classList.add('singleMovie');
    const singleObj = allEpisodes[e];

    pName.innerText =
      singleObj.name +
      " S" +
      ("0" + singleObj.season).slice(-2) +
      "E" +
      ("0" + singleObj.number).slice(-2);
    img.src = singleObj.image.medium;
    pSummary.innerHTML = singleObj.summary;
rootElem.appendChild(divContainer);
    divContainer.appendChild(pName);
    divContainer.appendChild(img);
    divContainer.appendChild(pSummary);
  });
}
const clearChildren = () => {
  while (rootElem.firstChild) {
    rootElem.removeChild(rootElem.lastChild);
  }
};
render(allEpisodes.map((v, i) => i));
render([1, 2, 3]);
