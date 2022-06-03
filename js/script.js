"use strict";

//Selecting elements
const galleryContainer = document.querySelector("#gallery");
const body = document.querySelector("body");
//URL to fetch data from 12 users
const URL = "https://randomuser.me/api/?results=12";
let employeesData, actualPosition, actualEmployee;

//Fetches data and returns response
const fetchData = async function (url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    throw err;
  }
};

//formats date of birth
const formatBirthday = function (date) {
  const birthday = new Date(date);
  const year = birthday.getFullYear();
  //Adding 1, because months are 0 index
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();
  //
  return `${String(month).padStart(2, 0)}/${String(day).padStart(
    2,
    0
  )}/${year}`;
};

//Formats cellphone number
const formatNumber = function (number) {
  const cleanNumber = number
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll(" ", "")
    .split("-")
    .join("");

  const regex = /\D*(\d{3})\D*(\d{3})\D*(\d{2,})\D*/;
  const replacement = "($1) $2-$3";
  return cleanNumber.replace(regex, replacement);
};

//Generates html for user's card
const generateCardHTML = function (employeeData) {
  const data = employeeData.results;
  const usersHTML = data
    .map(
      (data) => `
     <div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${data.picture.thumbnail}" alt="profile picture">
          </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
          <p class="card-text">${data.email}</p>
          <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
    </div>
  `
    )
    .join("");

  return usersHTML;
};

//generates html for modal window
const generateModalHTML = function (data) {
  const modalHTML = `
  <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${
                      data.picture.large
                    }" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${data.name.first} ${
    data.name.last
  }</h3>
                    <p class="modal-text">${data.email}</p>
                    <p class="modal-text cap">${data.location.city}</p>
                    <hr>
                    <p class="modal-text">${formatNumber(data.cell)}</p>
                    <p class="modal-text">${data.location.street.number} ${
    data.location.street.name
  }, ${data.location.city}, ${data.location.state} ${data.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formatBirthday(
                      data.dob.date
                    )}</p>
                </div>
            </div>
            <div class="modal-btn-container">
              <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
              <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
      </div>
  `;
  return modalHTML;
};

//Generates and display search bar
const generateSearchBar = function () {
  const searchBarHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
  `;
  const searchBarContainer = document.querySelector(".search-container");
  searchBarContainer.insertAdjacentHTML("beforeend", searchBarHTML);
};

//Handles card display
const cardHandler = function (data) {
  const cardsHTML = generateCardHTML(data);
  galleryContainer.insertAdjacentHTML("beforeend", cardsHTML);
};

//calls and inserts modal window
const modalHandler = (employeeData) => {
  const html = generateModalHTML(employeeData);
  body.insertAdjacentHTML("beforeend", html);
};

//helper function no close the modal
const closeModal = function () {
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.remove();
};

//Calling functions
(async function () {
  try {
    const data = await fetchData(URL);
    console.log(data);
    cardHandler(data);
    employeesData = data.results;
    const cards = document.querySelectorAll(".card");

    //Handling click in cards
    cards.forEach((card, i) => {
      card.addEventListener("click", function () {
        actualEmployee = employeesData[i];
        actualPosition = i;
        modalHandler(actualEmployee);
      });
    });

    generateSearchBar();
    //Selecting elements in search bar
    const searchValue = document.querySelector("#search-input");

    //Filtering search results
    searchValue.addEventListener("keyup", function (e) {
      const condition = e.target.value.toLowerCase();
      cards.forEach((card) => {
        if (
          !card.lastElementChild.firstElementChild.textContent
            .toLowerCase()
            .includes(condition)
        ) {
          card.style.display = "none";
        } else {
          card.style.display = "flex";
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
})();

//Helper function to manage click actions
const clickHandler = function (action) {
  closeModal();
  action === "modal-prev" ? (actualPosition -= 1) : (actualPosition += 1);
  actualEmployee = employeesData[actualPosition];
  modalHandler(actualEmployee);
};

//Prev and next buttons
body.addEventListener("click", function (e) {
  if (e.target.id === "modal-prev")
    if (actualPosition > 0) clickHandler("modal-prev");

  if (e.target.id === "modal-next")
    if (actualPosition < 11) clickHandler("modal-next");

  if (e.target.id === "modal-close-btn") closeModal();
});
