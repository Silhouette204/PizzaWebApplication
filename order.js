const mobileMenu = document.querySelector(".mobile-menu");
const desktopMenu = document.querySelector(".desktop-menu");

mobileMenu.addEventListener("click", () => {
  desktopMenu.style.display =
    desktopMenu.style.display === "none" ? "block" : "none";
});

const DOMElements = {
  customer: {
    name: document.getElementById("customerName"),
    address: document.getElementById("customerAddress"),
    contact: document.getElementById("customerContact"),
    email: document.getElementById("customerEmail"),
    country: document.getElementById("customerCountry"),
  },
  pizzaForm: {
    typeRadios: document.querySelectorAll('input[name="pizzaType"]'),
    crustRadios: document.querySelectorAll('input[name="crustType"]'),
    sizeRadios: document.querySelectorAll('input[name="pizzaSize"]'),
    toppingsCheckboxes: document.querySelectorAll('input[name="topping"]'),
    quantityInput: document.getElementById("pizzaQuantity"),
    addBtn: document.getElementById("addPizzaBtn"),
  },
  orderSummary: {
    pizzaList: document.getElementById("pizzaList"),
    totalPrice: document.getElementById("totalOrderPrice"),
    placeOrderBtn: document.getElementById("placeOrderBtn"),
    clearOrderBtn: document.getElementById("clearOrderBtn"),
  },
  receipt: {
    section: document.querySelector(".receipt-section"),
    headerDate: document.getElementById("receiptHeaderDate"),
    customerName: document.getElementById("receiptCustomerName"),
    customerAddress: document.getElementById("receiptCustomerAddress"),
    displayItems: document.getElementById("receiptDisplayItems"),
    subtotal: document.getElementById("receiptDisplaySubtotal"),
    tax: document.getElementById("receiptDisplayTax"),
    total: document.getElementById("receiptDisplayTotal"),
    barcodeImg: document.getElementById("receiptBarcode"),
    copyBtn: document.getElementById("copyReceiptDisplayBtn"),
  },
  messageBox: document.getElementById("messageBox"),
};

let currentOrderPizzas = [];

const PIZZA_PRICES = {
  "Ham and Cheese": { Small: 155.0, Medium: 469.0, Large: 699.0 },
  Hawaiian: { Small: 155.0, Medium: 549.0, Large: 799.0 },
  Pepperoni: { Small: 155.0, Medium: 519.0, Large: 769.0 },
  Veggie: { Small: 519.0, Medium: 769.0, Large: 825.0 },
  Italian: { Small: 519.0, Medium: 769.0, Large: 899.0 },
};

const CRUST_PRICES = {
  Thin: 50,
  Thick: 100,
};

const TOPPING_PRICE = 50;
const TAX_RATE = 0.1;

function showMessage(message, type = "success") {
  DOMElements.messageBox.textContent = message;
  DOMElements.messageBox.className = "message-box show";
  DOMElements.messageBox.style.backgroundColor =
    type === "error" ? "#a62103" : "#4CAF50";
  setTimeout(() => {
    DOMElements.messageBox.classList.remove("show");
  }, 3000);
}

function getSelectedRadioValue(radioElements) {
  const checkedRadio = Array.from(radioElements).find((radio) => radio.checked);
  return checkedRadio ? checkedRadio.value : null;
}

function getSelectedCheckboxValues(checkboxElements) {
  return Array.from(checkboxElements)
    .filter((checkBox) => checkBox.checked)
    .map((checkbox) => checkbox.value);
}

function calculatePizzaPrice(pizzaType, size, crust, toppings) {
  let price = 0;

  if (PIZZA_PRICES[pizzaType] && PIZZA_PRICES[pizzaType][size]) {
    price = PIZZA_PRICES[pizzaType][size];
  } else {
    return 0;
  }

  if (CRUST_PRICES[crust]) {
    price += CRUST_PRICES[crust];
  } else {
    console.warn(
      `Crust type '${crust}' not found in CRUST_PRICES. Price not added.`
    );
  }

  price += toppings.length * TOPPING_PRICE;
  return price;
}

function updateOrderSummary() {
  DOMElements.orderSummary.pizzaList.innerHTML = "";
  let totalOrderPrice = 0;

  if (currentOrderPizzas.length === 0) {
    DOMElements.orderSummary.pizzaList.innerHTML =
      '<li class="text-gray-500 italic">No pizzas added yet.</li>';
    DOMElements.orderSummary.totalPrice.textContent = "₱0.00";
    return;
  }

  currentOrderPizzas.forEach((pizza, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center text-sm py-2";

    const toppingsText =
      pizza.toppings.length > 0 ? ` + ${pizza.toppings.join(", ")}` : "";
    li.innerHTML = `
            <span>
            ${pizza.quantity} x ${pizza.size} ${pizza.type} (${
      pizza.crust
    } crust) ${toppingsText}
            <br> <span class="text-gray-500 text-xs">Price per pizza: ₱${pizza.pricePerPizza.toFixed(
              2
            )}</span>
            </span>
            <span class="font-semibold">₱${pizza.totalPizzaPrice.toFixed(
              2
            )}</span>
            <button class="remove-pizza-btn bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-full transition duration-300 ease-in-out" data-index="${index}">
                Remove
            </button>
            `;
    DOMElements.orderSummary.pizzaList.appendChild(li);
    totalOrderPrice += pizza.totalPizzaPrice;
  });

  DOMElements.orderSummary.totalPrice.textContent = `₱${totalOrderPrice.toFixed(
    2
  )}`;

  document.querySelectorAll(".remove-pizza-btn").forEach((button) => {
    button.addEventListener("click", removePizza);
  });
}

function removePizza(event) {
  const indexToRemove = parseInt(event.target.dataset.index);
  if (indexToRemove >= 0 && indexToRemove < currentOrderPizzas.length) {
    const removedPizza = currentOrderPizzas.splice(indexToRemove, 1)[0];
    showMessage(
      `Removed ${removedPizza.quantity}x ${removedPizza.type} from order.`
    );
    updateOrderSummary();
    renderReceipt();
  }
}

function resetPizzaForm() {
  DOMElements.pizzaForm.typeRadios.forEach((radio) => (radio.checked = false));
  DOMElements.pizzaForm.crustRadios.forEach((radio) => (radio.checked = false));
  DOMElements.pizzaForm.sizeRadios.forEach((radio) => (radio.checked = false));
  DOMElements.pizzaForm.toppingsCheckboxes.forEach(
    (checkbox) => (checkbox.checked = false)
  );
  DOMElements.pizzaForm.quantityInput.value = "1";
}

function renderReceipt() {
  if (currentOrderPizzas.length === 0) {
    clearReceiptDisplay();
    return;
  }

  const customerName = DOMElements.customer.name.value.trim();
  const customerAddress = DOMElements.customer.address.value.trim();

  DOMElements.receipt.headerDate.textContent = new Date().toLocaleString();
  DOMElements.receipt.customerName.textContent = customerName
    ? `Customer: ${customerName}`
    : "Customer: Not provided";
  DOMElements.receipt.customerAddress.textContent = customerAddress
    ? `Address: ${customerAddress}`
    : "Address: Not provided";

  DOMElements.receipt.displayItems.innerHTML = "";
  let subtotal = 0;

  currentOrderPizzas.forEach((pizza) => {
    const itemTotal = pizza.totalPizzaPrice;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "receipt-item-line";
    const toppingsText =
      pizza.toppings.length > 0 ? ` + ${pizza.toppings.join(", ")}` : "";
    div.innerHTML = `
            <span>${pizza.quantity}x ${pizza.size} ${
      pizza.type
    }${toppingsText}</span>
            <span>₱${itemTotal.toFixed(2)}</span>
        `;
    DOMElements.receipt.displayItems.appendChild(div);
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  DOMElements.receipt.subtotal.textContent = `₱${subtotal.toFixed(2)}`;
  DOMElements.receipt.tax.textContent = `₱${tax.toFixed(2)}`;
  DOMElements.receipt.total.textContent = `₱${total.toFixed(2)}`;

  const barcodeData = `${new Date().getTime()}-${total
    .toFixed(2)
    .replace(".", "")}`;
  try {
    JsBarcode(DOMElements.receipt.barcodeImg, barcodeData, {
      format: "CODE128",
      displayValue: true,
      height: 50,
      width: 2,
      margin: 10,
      fontSize: 14,
      lineColor: "#333",
      background: "#f9fafb",
    });
    DOMElements.receipt.barcodeImg.style.display = "block";
  } catch (e) {
    console.error("Error generating barcode:", e);
    showMessage(
      "Could not generate barcode. Invalid data or library issue.",
      "error"
    );
    DOMElements.receipt.barcodeImg.style.display = "none";
  }
}

function clearReceiptDisplay() {
  DOMElements.receipt.headerDate.textContent = "";
  DOMElements.receipt.customerName.textContent = "";
  DOMElements.receipt.customerAddress.textContent = "";
  DOMElements.receipt.displayItems.innerHTML =
    '<p class="text-center text-gray-500 italic">Place an order to see your receipt.</p>';
  DOMElements.receipt.subtotal.textContent = "₱0.00";
  DOMElements.receipt.tax.textContent = "₱0.00";
  DOMElements.receipt.total.textContent = "₱0.00";
  DOMElements.receipt.barcodeImg.style.display = "none";
}

function clearAllOrder() {
  currentOrderPizzas = [];
  updateOrderSummary();
  DOMElements.customer.name.value = "";
  DOMElements.customer.address.value = "";
  DOMElements.customer.contact.value = "";
  DOMElements.customer.email.value = "";
  DOMElements.customer.country.value = "";
  resetPizzaForm();
  clearReceiptDisplay();
  showMessage("Order cleared!");
}

function copyReceiptText() {
  const receiptContent = DOMElements.receipt.section.innerText;
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = receiptContent;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  try {
    document.execCommand("copy");
    showMessage("Receipt text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy receipt text:", err);
    showMessage("Failed to copy receipt text. Please copy manually.", "error");
  } finally {
    document.body.removeChild(tempTextArea);
  }
}

DOMElements.pizzaForm.addBtn.addEventListener("click", () => {
  const type = getSelectedRadioValue(DOMElements.pizzaForm.typeRadios);
  const crust = getSelectedRadioValue(DOMElements.pizzaForm.crustRadios);
  const size = getSelectedRadioValue(DOMElements.pizzaForm.sizeRadios);
  const toppings = getSelectedCheckboxValues(
    DOMElements.pizzaForm.toppingsCheckboxes
  );
  const quantity = parseInt(DOMElements.pizzaForm.quantityInput.value);

  if (!type || !crust || !size || isNaN(quantity) || quantity < 1) {
    showMessage(
      "Please select a pizza type, crust, size, and valid quantity (1-5).",
      "error"
    );
    return;
  }

  const pricePerPizza = calculatePizzaPrice(type, size, crust, toppings);
  if (pricePerPizza === 0) {
    showMessage(
      "Error: Could not determine pizza price. Check selections.",
      "error"
    );
    return;
  }

  const totalPizzaPrice = pricePerPizza * quantity;

  currentOrderPizzas.push({
    type,
    crust,
    size,
    toppings,
    quantity,
    pricePerPizza,
    totalPizzaPrice,
  });

  showMessage(`Added ${quantity}x ${size} ${type} to your order!`);
  updateOrderSummary();
  resetPizzaForm();
  renderReceipt();
});

DOMElements.orderSummary.placeOrderBtn.addEventListener("click", () => {
  const customerName = DOMElements.customer.name.value.trim();
  const customerAddress = DOMElements.customer.address.value.trim();
  const customerContact = DOMElements.customer.contact.value.trim();
  const customerEmail = DOMElements.customer.email.value.trim();
  const customerCountry = DOMElements.customer.country.value.trim();

  if (
    !customerName ||
    !customerAddress ||
    !customerContact ||
    !customerEmail ||
    !customerCountry
  ) {
    showMessage(
      "Please fill in all your contact details before placing the order.",
      "error"
    );
    return;
  }

  if (currentOrderPizzas.length === 0) {
    showMessage("Your order is empty! Please add some pizzas first.", "error");
    return;
  }

  renderReceipt();
  showMessage("Order placed successfully! Receipt generated.", "success");
});

DOMElements.orderSummary.clearOrderBtn.addEventListener("click", clearAllOrder);
DOMElements.receipt.copyBtn.addEventListener("click", copyReceiptText);

updateOrderSummary();
clearReceiptDisplay();
