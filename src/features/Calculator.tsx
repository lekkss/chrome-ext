import { useState } from "react";
const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  const handleNumber = (number: string) => {
    if (display === "0") {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperator = (operator: string) => {
    setEquation(display + " " + operator + " ");
    setDisplay("0");
  };

  const calculate = (equation: string, display: string): number => {
    const fullEquation = equation + display;
    const sanitizedEquation = fullEquation.trim();
    const parts = sanitizedEquation.split(" ");

    if (parts.length !== 3) return parseFloat(display);

    const num1 = parseFloat(parts[0]);
    const operator = parts[1];
    const num2 = parseFloat(parts[2]);

    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num2 !== 0 ? num1 / num2 : NaN;
      default:
        return parseFloat(display);
    }
  };

  const handleEqual = () => {
    try {
      const result = calculate(equation, display);
      if (isNaN(result)) {
        setDisplay("Error");
      } else {
        setDisplay(result.toString());
      }
      setEquation("");
    } catch (error) {
      console.log(error);
      setDisplay("Error");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };
  return (
    <div className="bg-gray-100 min-w-[400px] p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
        <div className="mb-4">
          <div className="text-gray-500 text-right h-6 text-sm overflow-x-auto">
            {equation}
          </div>
          <div className="text-4xl text-right font-semibold text-gray-800 h-12 overflow-x-auto">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={handleClear}
            className="col-span-2 bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            AC
          </button>
          <button
            onClick={() => handleOperator("/")}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ÷
          </button>
          <button
            onClick={() => handleOperator("*")}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ×
          </button>

          {[7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator("-")}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            -
          </button>

          {[4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleOperator("+")}
            className="bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            +
          </button>

          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleEqual}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            =
          </button>

          <button
            onClick={() => handleNumber("0")}
            className="col-span-2 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            0
          </button>
          <button
            onClick={() => handleNumber(".")}
            className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
