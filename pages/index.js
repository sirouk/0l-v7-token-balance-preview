import { useState } from 'react';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [v5Balance, setV5Balance] = useState(null);

  const fetchBalances = async () => {
    try {
      const responseV7 = await fetch(`https://rpc.0l.fyi/v1/accounts/${address}/resources`);
      const dataV7 = await responseV7.json();
      setData(dataV7);

      const responseV5 = await fetch('http://63.229.234.76:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "get_account",
          params: [address],
          id: 1
        })
      });
      const dataV5 = await responseV5.json();
      setV5Balance(dataV5.result?.balance || 0);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const extractData = (type) => {
    return data?.find(item => item.type === type)?.data || {};
  };

  return (
    <div className="container">
      <img src="/0L-logo.png" alt="0L Network" className="logo" />
      <h1>0L v7 Token Balance Preview</h1>
      <p>Enter your 0L v5 Address:</p>
      <div className="input-container">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter v5 Address"
        />
        <button onClick={fetchBalances}>Submit</button>
      </div>
      {data && (
        <div className="data-container">
          <h2>Account Details</h2>
          <p>Sequence Number: {extractData("0x1::account::Account").sequence_number}</p>
          <p>Authentication Key: {extractData("0x1::account::Account").authentication_key}</p>
          
          <h2>Balance</h2>
          <p>v5 Balance: {v5Balance}</p>
          <p>v7 Balance: {extractData("0x1::coin::CoinStore<0x1::gas_coin::LibraCoin>").coin.value}</p>

          <h2>Slow Wallet</h2>
          <p>Transferred: {extractData("0x1::slow_wallet::SlowWallet").transferred}</p>
          <p>Unlocked: {extractData("0x1::slow_wallet::SlowWallet").unlocked}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
