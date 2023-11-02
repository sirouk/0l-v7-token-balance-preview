import { useState } from 'react';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [chainInfo, setChain] = useState(null);
  const [v7Data, setData] = useState(null);
  const [v5Balance, setV5Balance] = useState(null);

  const fetchBalances = async () => {
    try {
      
      const chainInfoReq = await fetch(`https://rpc.0l.fyi/v1/`);
      const chainInfo = await chainInfoReq.json();
      console.log(chainInfo);
      setChain(chainInfo);

      const formattedAddress = address.toLowerCase();             // Convert the address to lowercase
      const cleanAddress = formattedAddress.replace(/^0x/, '');      // Remove the leading 0x for v5 request

      const v7DataReq = await fetch(`https://rpc.0l.fyi/v1/accounts/0x${cleanAddress}/resources`);
      const v7Data = await v7DataReq.json();
      console.log(v7Data);
      setData(v7Data);

  
      const v5DataReq = await fetch('https://mainnet-v5-rpc.openlibra.space:8080', {
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
      const v5Data = await v5DataReq.json();
      console.log(v5Data);
      const v5Amount = v5Data.result.balances[0]?.amount || 0;  // Extracting the amount from the v5 response
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
          

          <h2>Account Details:</h2>
          <p>Authentication Key: {extractData("0x1::account::Account").authentication_key}</p>
          
          <h2>Balance Details:</h2>
          <p>v5 Balance: {formatNumber((v5Balance * 0.000001).toFixed(6))}</p>
          <p>v7 Balance: {formatNumber((extractData("0x1::coin::CoinStore<0x1::gas_coin::LibraCoin>").coin.value * 0.000001).toFixed(6))}</p>

          <h2>Chain Info:</h2>
          <p>v5 Chain ID: {data.diem_chain_id}</p>
          <p>v7 Chain ID: {chainInfo.chain_id}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
