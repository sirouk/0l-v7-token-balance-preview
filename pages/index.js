
import { useState } from 'react';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`https://rpc.0l.fyi/v1/accounts/${address}/resources`);
      const data = await response.json();
      console.log(data);
      setBalance(data.balance); // Assuming 'balance' is a key in the response
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div>
      <h1>0L v7 Token Balance Preview</h1>
      <div>
        <img src="/0L-logo.png" alt="0L Network" width="150" />      
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter v5 Address"
        />
        <button onClick={fetchBalance}>Submit</button>
      </div>
      {balance && <div>Balance: {balance}</div>}
    </div>
  );
};

export default HomePage;
