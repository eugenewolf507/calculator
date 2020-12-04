class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  // variables
  // previousOperand - the user is entered - top number in output
  // currentOperand - the user is working on - bootom number in output
  // operation

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  plusMinus() {
    // debugger;
    if (this.currentOperand === "") {
      this.currentOperand = "-";
      return;
    }

    if (this.currentOperand === "-") {
      this.currentOperand = "";
      return;
    }

    this.currentOperand = this.currentOperand * -1;
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    // if user try to select operation that deals with two numbers without entered number
    if (this.currentOperand === "") return;

    // for square root operation
    if (operation === "sqrt‎") {
      this.operation = operation;
      this.sqrtCompute();
      return;
    }

    // for calculating when two operands exist
    // and user click on operation buttons +, -, *, /, pow
    if (this.previousOperand !== "") {
      this.compute();
    }

    // when only one operand exist and user click on operation button
    // next user must to enter second number
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      this.readyToReset = true;
      return;
    }
    switch (this.operation) {
      case "+":
        computation = this.getPerfectDecimalNumber(prev + current);
        break;

      case "-":
        computation = this.getPerfectDecimalNumber(prev - current);
        break;

      case "*":
        computation = this.getPerfectDecimalNumber(prev * current);
        break;

      case "÷":
        computation = this.getPerfectDecimalNumber(prev / current);
        break;

      case "pow":
        computation = this.getPerfectDecimalNumber(Math.pow(prev, current));
        break;

      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  // computation for square root, as it work with only one number
  sqrtCompute() {
    let computation;
    const current = parseFloat(this.currentOperand);

    if (isNaN(current)) return;

    //because sqrt returns NaN if current is negative
    if (current < 0) {
      errorDiv.style.display = "flex";
      this.currentOperand = "";
      this.operation = undefined;
      this.previousOperand = "";
      return;
    }

    computation = this.getPerfectDecimalNumber(Math.sqrt(current));

    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  // the function is added for correct work with decimal numbers
  // on the first step we rounding the number to keep only 10 decimals
  // on the second step we return a floating-point number without long tail of zeroes in our number
  getPerfectDecimalNumber(number) {
    const fixedNumber = number.toFixed(10);
    return parseFloat(fixedNumber);
  }

  getDisplayNumber(number) {
    if (number === "-") return "-";
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const sqrtButton = document.querySelectorAll("[data-sqrt]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const plusMinusButton = document.querySelector("[data-plus-minus]");
const allClearButton = document.querySelector("[data-all-clear]");
const errorDiv = document.querySelector("[data-error]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
      calculator.readyToReset
    ) {
      calculator.currentOperand = "";
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

// for square root button
sqrtButton.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

plusMinusButton.addEventListener("click", (button) => {
  calculator.plusMinus();
  calculator.updateDisplay();
});

errorDiv.addEventListener("click", () => {
  errorDiv.style.display = "none";
});
