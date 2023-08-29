import React, { useEffect } from "react";

function App() {
  let inputStack = []; // Holds user inputs
  let opcodeStack = []; // Stores the opcodes to be used in the calculation
  let outputQueue = []; // Stores the operands, and once calculated, the result

  // Add event listeners on load to calculator buttons and push them to input stack when clicked
  useEffect(() => {
    const buttons = document.getElementsByClassName("button");
    Array.from(buttons).forEach(item => {
      item.addEventListener('click', e => {
        if (e.currentTarget.innerText !== "=" && e.currentTarget.innerText !== "AC" && e.currentTarget.innerText !== "backspace") {
          // Push the input to input stack
          inputStack.push(e.currentTarget.innerText);
          // If input is operator show it in different colour in preview otherwise numbers are shown in grey in preview
          if (e.currentTarget.innerText === "+" || e.currentTarget.innerText === "-" || e.currentTarget.innerText === "/" || e.currentTarget.innerText === "*") {
            document.getElementById("input-preview").insertAdjacentHTML("beforeend", "<span id='prev-inner' style='color:#1195f1'>"+e.currentTarget.innerText+"</span>");
          }
          else {
            document.getElementById("input-preview").insertAdjacentHTML("beforeend", "<p id='prev-inner'>" + e.currentTarget.innerText + "</p>");
          }
        }
      });
    });
  },[]);

  // Check operator precedence for calculations in correct BODMAS order
  const checkPrecedence = (value) => {
    switch (value) {
      case "/":
        return 4;
      case "*":
        return 3;
      case "+":
        return 2;
      case "-":
        return 1;
      default:
        return 0;
    }
  };

  // Checks the opcode of the two operands and performs the appropriate calculations
  const checkOpcodeAndCalculate = (opcode, value1, value2) => {
    let res;
    switch (opcode) {
      case "+":
        res = parseFloat(value1) + parseFloat(value2);
        break;
      case "-":
        res = parseFloat(value1) - parseFloat(value2);
        break;
      case "*":
        res = parseFloat(value1) * parseFloat(value2);
        break;
      case "/":
        res = parseFloat(value1) / parseFloat(value2);
        break;
      default:
        return 0;
    }
    return res;
  }

  // Shunting yard algorithm to convert infix to postfix and calculate the conversion
  const shuntingyard = (tokenList) => {
    for (let i = 0; i < tokenList.length; i++) {
      if (tokenList[i] === "+" || tokenList[i] === "-" || tokenList[i] === "/" || tokenList[i] === "*") {
        // Calculates the value of two operands with a high-precedence opcode. Eg, 9*2+1, the 9*2 will be executed in the if statement and the result placed on output queue
        if (checkPrecedence(opcodeStack[opcodeStack.length-1]) > checkPrecedence(tokenList[i])) {
          let opcode = opcodeStack.pop();
          let value2 = outputQueue.pop();
          let value1 = outputQueue.pop();
          let res = checkOpcodeAndCalculate(opcode, value1, value2);
          outputQueue.push(res);
        }
        opcodeStack.push(tokenList[i]); // Push opcode to opcode stack (any opcodes with a higher precedence will not be pushed here as it will have already been used for a calculation)
      }
      // If user pressed "=" with empty value then assign empty value as 0 for calculation to occur
      else if (tokenList[i] === "") {
        outputQueue.push(0);
      }
      else {
        outputQueue.push(tokenList[i]); // Add number to output queue
      }
    }

    // While there are opcodes in the opcode stack, calculate the result
    while (opcodeStack.length !== 0 && opcodeStack) {
      let value2 = outputQueue.pop();
      let value1 = outputQueue.pop();
      let opcodeValue = opcodeStack.pop();
      let res = checkOpcodeAndCalculate(opcodeValue, value1, value2);
      outputQueue.push(+res.toFixed(4));
    }
  }

  // Called when user clicks "="
  const calculate = () => {
    // Converts characters in input stack into a string which is split at the points of opcodes
    const stringifiedVal = inputStack.join("");
    const tokenList = stringifiedVal.split(/(\+|-|\*|\/)/g);
    // Converts infix notation to postfix and calculates
    console.log(tokenList)
    shuntingyard(tokenList);
    // Retrieve result
    let calculatedResult = outputQueue[0];
    // Handle empty result
    if (calculatedResult === "") {
      document.getElementById("result-output").innerText = "0";
    }
    else {
      document.getElementById("result-output").innerText = calculatedResult;
    }
    // Clear output queue but keep state of other stacks so user can continue working with values after calculation
    outputQueue = [];

    console.log(calculatedResult);
  }

  // Called when AC (all clear) clicked
  const allclear = () => {
    inputStack = [];
    opcodeStack = [];
    outputQueue = [];
    document.getElementById("input-preview").innerHTML = "";
    document.getElementById("result-output").innerText = "0";
  }

  // Remove element from preview and input stack
  const backspace = () => {
    if (inputStack.length !== 0) {
      inputStack.pop();
      document.querySelector("#input-preview #prev-inner:last-child").remove();
    }
  }

  return (
    <div className="calculator-box">
      <div className="result-box">
        <div className="preview">
          <p id="input-preview"></p>
        </div>
        <div className="output">
          <p id="result-output">0</p>
        </div>
      </div>
      <div className="input-box">
        <div className="button spec1" onClick={allclear}>AC</div>
        <div className="button spec1" onClick={backspace}><span class="material-symbols-outlined iconConfig">backspace</span></div>
        <div className="button spec2">/</div>
        <div className="button spec2">*</div>
        <div id="num" className="button">7</div>
        <div id="num" className="button">8</div>
        <div id="num" className="button">9</div>
        <div className="button spec2">-</div>
        <div id="num" className="button">4</div>
        <div id="num" className="button">5</div>
        <div id="num" className="button">6</div>
        <div className="button spec2">+</div>
        <div id="num" className="button">1</div>
        <div id="num" className="button">2</div>
        <div id="num" className="button">3</div>
        <div id="num" className="button zero">0</div>
        <div id="num" className="button">.</div>
        <div className="button equals" onClick={calculate}>=</div>
      </div>
    </div>
  );
}

export default App;
