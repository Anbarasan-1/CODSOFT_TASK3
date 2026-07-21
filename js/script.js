const previousOperation = document.getElementById("previousOperation");
const currentOperation = document.getElementById("currentOperation");

const numberButtons = document.querySelectorAll(".number-btn");
const operatorButtons = document.querySelectorAll(".operator-btn");
const actionButtons = document.querySelectorAll("[data-action]");



let currentValue = "0";
let previousValue = "";
let selectedOperator = "";
let shouldResetDisplay = false;



function updateDisplay() {
    currentOperation.textContent = currentValue;

    if (previousValue !== "" && selectedOperator !== "") {
        previousOperation.textContent =
            `${previousValue} ${getOperatorSymbol(selectedOperator)}`;
    } else {
        previousOperation.textContent = "";
    }
}



function getOperatorSymbol(operator) {
    if (operator === "+") {
        return "+";
    } else if (operator === "-") {
        return "−";
    } else if (operator === "*") {
        return "×";
    } else if (operator === "/") {
        return "÷";
    }

    return "";
}



function inputNumber(number) {

    if (currentValue === "Error" || shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (number === ".") {

        if (currentValue.includes(".")) {
            return;
        }

        if (currentValue === "") {
            currentValue = "0";
        }
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}



function selectOperator(operator) {

    if (currentValue === "Error") {
        return;
    }

    if (selectedOperator !== "" && shouldResetDisplay === false) {
        calculate();
    }

    previousValue = currentValue;
    selectedOperator = operator;
    shouldResetDisplay = true;

    updateDisplay();
}



function calculate() {

    if (
        previousValue === "" ||
        selectedOperator === "" ||
        currentValue === "Error"
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    if (selectedOperator === "+") {

        result = firstNumber + secondNumber;

    } else if (selectedOperator === "-") {

        result = firstNumber - secondNumber;

    } else if (selectedOperator === "*") {

        result = firstNumber * secondNumber;

    } else if (selectedOperator === "/") {

        if (secondNumber === 0) {
            showError();
            return;
        }

        result = firstNumber / secondNumber;
    }

    result = roundResult(result);

    previousOperation.textContent =
        `${previousValue} ${getOperatorSymbol(selectedOperator)} ${currentValue} =`;

    currentValue = result.toString();
    previousValue = "";
    selectedOperator = "";
    shouldResetDisplay = true;

    currentOperation.textContent = currentValue;
}




function roundResult(number) {
    return Math.round((number + Number.EPSILON) * 100000000) / 100000000;
}



function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    selectedOperator = "";
    shouldResetDisplay = false;

    updateDisplay();
}




function deleteLastCharacter() {

    if (currentValue === "Error" || shouldResetDisplay) {
        return;
    }

    if (
        currentValue.length === 1 ||
        (currentValue.length === 2 && currentValue.startsWith("-"))
    ) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}




function calculatePercentage() {

    if (currentValue === "Error") {
        return;
    }

    const number = parseFloat(currentValue);

    currentValue = roundResult(number / 100).toString();

    updateDisplay();
}



function showError() {
    currentValue = "Error";
    previousValue = "";
    selectedOperator = "";
    shouldResetDisplay = true;

    updateDisplay();
}



numberButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        inputNumber(value);
    });

});




operatorButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const operator = button.dataset.value;

        selectOperator(operator);
    });

});



actionButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {

            clearCalculator();

        } else if (action === "delete") {

            deleteLastCharacter();

        } else if (action === "percentage") {

            calculatePercentage();

        } else if (action === "calculate") {

            calculate();
        }
    });

});




document.addEventListener("keydown", (event) => {

    const key = event.key;

    if ((key >= "0" && key <= "9") || key === ".") {

        inputNumber(key);

    } else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        selectOperator(key);

    } else if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

    } else if (key === "Backspace") {

        deleteLastCharacter();

    } else if (key === "Escape") {

        clearCalculator();

    } else if (key === "%") {

        calculatePercentage();
    }

});




updateDisplay();