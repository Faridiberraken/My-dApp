import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import "./App.css";

function App() {
  const [contract, setContract] = useState(null);
  const [storedValue, setStoredValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const contractABI = [
    "function get() view returns (uint256)",
    "function set(uint256 _value)",
  ];

  const connectWallet = async () => {
    const provider = new BrowserProvider(window.ethereum); // Updated for ethers v6
    await provider.send("eth_requestAccounts", []); // Request access to MetaMask

    const signer = await provider.getSigner(); // Get signer for transactions

    // Use the signer for the contract (for both reading and writing)
    const simpleStorageContract = new Contract(
      contractAddress,
      contractABI,
      signer
    );

    setContract(simpleStorageContract); // Set the contract for later use
  };

  const getValue = async () => {
    if (!contract) return;
    try {
      const value = await contract.get(); // Read operation using the contract with signer
      setStoredValue(value.toString());
    } catch (error) {
      console.error("Error getting value:", error);
    }
  };

  const setValue = async () => {
    if (!contract) return;
    try {
      const tx = await contract.set(inputValue); // Write operation
      await tx.wait(); // Wait for the transaction to be mined
      getValue(); // Refresh the stored value after setting
    } catch (error) {
      console.error("Error setting value:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Storage DApp</h1>
        {!contract && <button onClick={connectWallet}>Connect Wallet</button>}
        <div>
          <button onClick={getValue}>Get Stored Value</button>
          {storedValue && <p>Stored Value: {storedValue}</p>}
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={setValue}>Set Value</button>
        </div>
      </header>
    </div>
  );
}

export default App;
