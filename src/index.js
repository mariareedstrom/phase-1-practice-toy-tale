let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toyCollection = document.querySelector("#toy-collection");
const toyURL = "http://localhost:3000/toys";
const container = document.querySelector("body > div.container > form");

// event listeners
container.addEventListener("submit", handleCreateToy);

//HANDLER function
// create new toy function, toy is object
function handleCreateToy(e) {
  e.preventDefault();
  let toyObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0,
  };

  renderToyCard(toyObj);
  createNewToy(toyObj);
}

// HANDLER function
//register likes when likeButtons clicked
function patchLikes(toyId, likes) {
  return fetch(`${toyURL}/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ likes }),
  });
}

function renderLikes(card, likes, toyName) {
  card.dataset.likes = likes;
  const likesCounter = card.querySelector(`#toy-likes-${card.dataset.id}`);
  likesCounter.innerText = `${toyName} has ${likes} likes!`;
}

// DOM render functions
function renderToyCard(toy) {
  // build toy card
  let card = document.createElement("li");
  card.id = `toy-item-${toy.id}`;
  card.dataset.id = toy.id;

  card.className = "card";
  card.innerHTML = `
   <div> 
    <h2>"${toy.name}"</h2>
    <img src="${toy.image}" class="toy-avatar"/>
    <p id="toy-likes-${toy.id}"></p>
    <button class="like-btn">Like <3</button>
    </div>`;

  const likeButton = card.querySelector(".like-btn");

  renderLikes(card, toy.likes, toy.name);

  likeButton.addEventListener("click", (event) => {
    const numLikes = parseInt(card.dataset.likes) + 1;
    patchLikes(toy.id, numLikes).then((resp) => {
      renderLikes(card, numLikes, toy.name);
    });
  });

  // add toy card to div (DOM)
  document.querySelector("#toy-collection").appendChild(card);
}
// fetch GET request
// get fetch for all toy reasources
function getAllToys() {
  fetch(toyURL)
    .then((resp) => resp.json())
    .then((toyData) => toyData.forEach((toy) => renderToyCard(toy)));
}

// POST request to toyUrl via fetch() with second argument (function)
function createNewToy(toyObj) {
  fetch(toyURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(toyObj),
  }).then((resp) => resp.json().then((toy) => console.log(toy)));
}

// PATCH request for likes

// initial render function
// get data and render to DOM
function initialize() {
  getAllToys();
  // toysData.forEach((toy) => renderToyCard(toy));
}

initialize();
