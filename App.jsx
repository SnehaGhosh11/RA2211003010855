import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URLS = {
  prime: "http://20.244.56.144/test/primes",
  fibo: "http://20.244.56.144/test/fibo",
  even: "http://20.244.56.144/test/even",
  rand: "http://20.244.56.144/test/rand",
};

const SLIDING_WINDOW_SIZE = 10;

const AverageCalculator = () => {
  const [selectedType, setSelectedType] = useState("prime");
  const [numbers, setNumbers] = useState([]);
  const [average, setAverage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNumbers();
  }, [selectedType]);

  const fetchNumbers = async () => {
    try {
      console.log(`Fetching numbers from: ${API_URLS[selectedType]}`);
      const response = await axios.get(API_URLS[selectedType]);

      if (response.data && response.data.numbers) {
        updateNumbers(response.data.numbers);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (error) {
      console.error("Error fetching numbers:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const updateNumbers = (newNumbers) => {
    if (!Array.isArray(newNumbers)) {
      console.error("Received invalid numbers array:", newNumbers);
      return;
    }
    const updatedNumbers = [...numbers, ...newNumbers].slice(
      -SLIDING_WINDOW_SIZE
    );
    setNumbers(updatedNumbers);
    calculateAverage(updatedNumbers);
  };

  const calculateAverage = (numArray) => {
    if (numArray.length === 0) return;
    const sum = numArray.reduce((acc, num) => acc + num, 0);
    setAverage(sum / numArray.length);
  };

  return (
    <div
      style={{
        color: "white",
        backgroundColor: "#1e1e1e",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>Sliding Window Average Calculator</h2>
      <label>Select Number Type: </label>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="prime">Prime</option>
        <option value="fibo">Fibonacci</option>
        <option value="even">Even</option>
        <option value="rand">Random</option>
      </select>
      <button
        onClick={fetchNumbers}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        Fetch Numbers
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>Numbers: {numbers.join(", ")}</h3>
      <h3>Average: {average.toFixed(2)}</h3>
    </div>
  );
};

export default AverageCalculator;
