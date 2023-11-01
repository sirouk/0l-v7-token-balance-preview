
import { useState } from 'react';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`https://rpc.0l.fyi/v1/accounts/${address}/resources`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const extractData = (type) => {
    return data.find(item => item.type === type)?.data || {};
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
      {data && (
        <div>
          
          <h2>Account Details</h2>
          <p>Sequence Number: {extractData("0x1::account::Account").sequence_number}</p>
          <p>Authentication Key: {extractData("0x1::account::Account").authentication_key}</p>
          
          <h2>Balance</h2>
          <p>Current Balance: {extractData("0x1::coin::CoinStore<0x1::gas_coin::LibraCoin>").coin.value}</p>

          <h2>Slow Wallet</h2>
          <p>Transferred: {extractData("0x1::slow_wallet::SlowWallet").transferred}</p>
          <p>Unlocked: {extractData("0x1::slow_wallet::SlowWallet").unlocked}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
