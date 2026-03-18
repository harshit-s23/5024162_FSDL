import { useState } from "react";

function Converter() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");

  const convertToFahrenheit = () => {
    if (celsius === "") return;
    const f = (celsius * 9) / 5 + 32;
    setFahrenheit(f.toFixed(2));
  };

  const convertToCelsius = () => {
    if (fahrenheit === "") return;
    const c = ((fahrenheit - 32) * 5) / 9;
    setCelsius(c.toFixed(2));
  };

  return (
    <div className="converter">

      <div className="box">
        <label>Celsius</label>
        <input
          type="number"
          placeholder="Enter Celsius"
          value={celsius}
          onChange={(e) => setCelsius(e.target.value)}
        />
        <button onClick={convertToFahrenheit}>
          Convert to Fahrenheit
        </button>
      </div>

      <div className="box">
        <label>Fahrenheit</label>
        <input
          type="number"
          placeholder="Enter Fahrenheit"
          value={fahrenheit}
          onChange={(e) => setFahrenheit(e.target.value)}
        />
        <button onClick={convertToCelsius}>
          Convert to Celsius
        </button>
      </div>

    </div>
  );
}

export default Converter;