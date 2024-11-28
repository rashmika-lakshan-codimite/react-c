import React, { useState, useEffect } from "react";
import initializeModule from "./wasm/math.js";

function App() {
  const [wasmModule, setWasmModule] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWasmModule = async () => {
      try {
        console.log("Imported module:", initializeModule);
        console.log("Module type:", typeof initializeModule);

        // Try different initialization approaches
        let module;
        if (typeof initializeModule === "function") {
          module = await initializeModule();
        } else if (
          initializeModule.default &&
          typeof initializeModule.default === "function"
        ) {
          module = await initializeModule.default();
        } else {
          throw new Error("Unable to initialize module: not a function");
        }

        console.log("Initialized module:", module);

        setWasmModule(module);
      } catch (err) {
        console.error("Failed to load WASM module", err);
        setError(`Initialization error: ${err.message}`);
      }
    };

    loadWasmModule();
  }, []);

  const handleAddClick = () => {
    if (wasmModule) {
      try {
        const addFunc = wasmModule.cwrap("add", "number", ["number", "number"]);
        const result = addFunc(5, 7);
        setResult(`5 + 7 = ${result}`);
      } catch (err) {
        console.error("Add function error", err);
        setError(`Add function error: ${err.message}`);
      }
    }
  };

  const handleFactorialClick = () => {
    if (wasmModule) {
      try {
        const factorialFunc = wasmModule.cwrap("factorial", "number", [
          "number",
        ]);
        const result = factorialFunc(5);
        setResult(`5! = ${result}`);
      } catch (err) {
        console.error("Factorial function error", err);
        setError(`Factorial function error: ${err.message}`);
      }
    }
  };

  if (error) {
    return (
      <div>
        <h1>Error Loading WebAssembly Module</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>WebAssembly C Functions</h1>
      <button onClick={handleAddClick}>Add Numbers</button>
      <button onClick={handleFactorialClick}>Calculate Factorial</button>
      {result && <p>{result}</p>}
    </div>
  );
}

export default App;
