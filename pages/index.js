import { useState } from 'react';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [chainInfo, setChain] = useState(null);
  const [data, setData] = useState(null);
  const [v5Balance, setV5Balance] = useState(null);

  const fetchBalances = async () => {
    try {
      
      const chainInfoReq = await fetch(`https://rpc.0l.fyi/v1/`);
      const chainInfo = await chainInfoReq.json();
      console.log(chainInfo);
      setChain(chainInfo);

      const formattedAddress = address.toLowerCase();             // Convert the address to lowercase
      const cleanAddress = formattedAddress.replace(/^0x/, '');      // Remove the leading 0x for v5 request

      const responseV7 = await fetch(`https://rpc.0l.fyi/v1/accounts/0x${cleanAddress}/resources`);
      const dataV7 = await responseV7.json();
      console.log(dataV7);
      setData(dataV7);

  
      const responseV5 = await fetch('https://mainnet-v5-rpc.openlibra.space:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "get_account",
          params: [cleanAddress],
          id: 1
        })
      });
      const dataV5 = await responseV5.json();
      console.log(dataV5);
      const v5Amount = dataV5.result.balances[0]?.amount || 0;  // Extracting the amount from the v5 response
      setV5Balance(v5Amount);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };  

  const extractData = (type) => {
    return data?.find(item => item.type === type)?.data || {};
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="container">
      <img src="/0L-logo.png" alt="0L Network" className="logo" />
      <h1>v7 Token Split Preview</h1>
      <p>Enter your 0L v5 Address:</p>
      <div className="input-container">
        <input
          type="text"
          className="address-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter v5 Address"
        />
        <button onClick={fetchBalances}>Submit</button>
      </div>
      {data && (
        <div className="data-container">
          <h2>Chain Info:</h2>
          <p>Chain ID: {extractData("chain_id")}</p>

          <h2>Account Details:</h2>
          <p>Authentication Key: {extractData("0x1::account::Account").authentication_key}</p>
          
          <h2>Balance Details:</h2>
          <p>v5 Balance: {formatNumber((v5Balance * 0.000001).toFixed(6))}</p>
          <p>v7 Balance: {formatNumber((extractData("0x1::coin::CoinStore<0x1::gas_coin::LibraCoin>").coin.value * 0.000001).toFixed(6))}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
