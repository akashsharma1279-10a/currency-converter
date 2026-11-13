
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Fetch exchange rate
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);

    if (isNaN(amtVal) || amtVal <= 0) {
      amtVal = 1;
      amount.value = "1";
    }

    let fromCode = fromCurr.value.toLowerCase();
    let toCode = toCurr.value.toLowerCase();

    let URL = `${BASE_URL}/${fromCode}.json`;

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    let data = await response.json();

    let rate = data[fromCode][toCode];

    if (rate === undefined) {
      throw new Error("Exchange rate unavailable");
    }

    let finalAmount = amtVal * rate;

    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {
    msg.innerText = "Unable to get exchange rate. Please try again.";
    console.error(error);
  }
};

// Update country flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load exchange rate when page opens
window.addEventListener("load", () => {
  updateExchangeRate();
});
