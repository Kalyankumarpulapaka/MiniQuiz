import React, { useState } from 'react';
import { evaluate } from 'mathjs'; // Import the evaluate function from mathjs
import './Calculator.css';

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Handler for button clicks
  const handleClick = (value) => {
    setInput(prevInput => prevInput + value);
  };

  // Function to evaluate the expression safely using mathjs
  const calculate = () => {
    try {
      // Validate input to ensure it's safe (allow only numbers and math symbols)
      if (input.match(/[^0-9+\-*/().\s]/)) {
        setResult('Error');
        return;
      }

      // Evaluate the expression using mathjs's evaluate function
      const evalResult = evaluate(input);

      // Check if the result is a valid number
      if (isNaN(evalResult)) {
        setResult('Error');
      } else {
        setResult(evalResult);
      }
    } catch (error) {
      setResult('Error');
    }
  };

  // Handler for clearing the input and result
  const clear = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="calculator">
      <div className="display">
        <input type="text" value={input} readOnly className="input" />
        <div className="result">{result}</div>
      </div>
      <div className="buttons">
        {['1', '2', '3', '+'].map((item) => (
          <button key={item} onClick={() => handleClick(item)} className="button">{item}</button>
        ))}
        {['4', '5', '6', '-'].map((item) => (
          <button key={item} onClick={() => handleClick(item)} className="button">{item}</button>
        ))}
        {['7', '8', '9', '*'].map((item) => (
          <button key={item} onClick={() => handleClick(item)} className="button">{item}</button>
        ))}
        {['0', '.', '/'].map((item) => (
          <button key={item} onClick={() => handleClick(item)} className="button">{item}</button>
        ))}
        <button onClick={calculate} className="button equal-button">=</button>
        <button onClick={clear} className="clear-button">Clear</button>
      </div>
    </div>
  );
}

export default Calculator;
