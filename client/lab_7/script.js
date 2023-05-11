function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#resturant_list");
  (target.innerHTML = ""),
    list.forEach((item, index) => {
      const str = `<li>${item.name}</li>`;
      target.innerHTML += str;
    });
}

function filterList(List, query) {
  return List.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutResturantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item, index) => {
    const idx = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const mainForm = document.querySelector("#main_form"); // This class name needs to be set on your form before you can listen for an event on it
  const filterbutton = document.querySelector("#filter_button");
  const LoadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";

  let storedList = [];
  let currentList = [];

  LoadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("form submission"); // this is substituting for a "breakpoint"
    loadAnimation.style.display = "inline-block";
    /*
      ## GET requests and Javascript
        We would like to send our GET request so we can control what we do with the results
        But this blocks us sending a query string by default - ?resto='' won't exist

        Let's get those form results before sending off our GET request using the Fetch API
    */

    // this is the preferred way to handle form data in JS in 2022
    const formData = new FormData(mainForm); // get the data from the listener target
    const formProps = Object.fromEntries(formData); // Turn it into an object

    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
    );

    storedtList = await results.json();

    loadAnimation.style.display = "none";
    console.table(storedList);
  });

  filterbutton.addEventListener("click", (event) => {
    console.log("clicked FilterButton");

    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(currentList, formProps.resto);
    injectHTML(newList);
    console.log(newList);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutResturantList(storedList);
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    injectHTML(newList);
    console.log(newList);
  });
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
