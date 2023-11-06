"use client"; // This is a client component
import Image from 'next/image'
import { useState } from 'react';

const HomePage = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [v5Balance, setV5Balance] = useState(null);
  const [supplyInfo, setSupplyInfo] = useState(null);
  const [v5SupplyInfo, setSupplyInfoV5] = useState(null);
  const [v5Chain, setv5ChainID] = useState(null);
  const [chainInfo, setChain] = useState(null);
  const [cleanAddress, setMoreInfo] = useState(null);

  const fetchBalances = async () => {
    try {
      
      const chainInfoReq = await fetch(`https://rpc.0l.fyi/v1/`);
      const chainInfo = await chainInfoReq.json();
      console.log(chainInfo);
      setChain(chainInfo);

      const supplyInfoPayload = {
        key_type: "address",
        value_type: "u128",
        key: "0xa7e1af6d61e958dbefe8f35550aab562f8923634cd7f438bc5190e99ca5fb07c"
      };
      const supplyInfoReq = await fetch('https://rpc.0l.fyi/v1/tables/0xfc074a2b7638a50ba678ce381a2350a28264f4da004603adb8dc36d125750108/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(supplyInfoPayload)
      });
      const supplyInfo = await supplyInfoReq.json(); // Assuming the response is in JSON format
      console.log(supplyInfo);
      setSupplyInfo(supplyInfo);

      
      try {
          //const response = await fetch('/api/fetchVitals'); // if we want to host it server side
          const response = await fetch('https://v5-vitals-for-v7-token-preview.tvboxsupreme.workers.dev');
          
          // Check if the response is okay
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log(data);
          const v5TotalSupply = formatNumber(data.chain_view.total_supply.toFixed(6));
          setSupplyInfoV5(v5TotalSupply);
      } catch (error) {
          console.error('Error:', error);
      
          // Placeholder or default value in case of error
          const placeholderData = 'error';
          setSupplyInfoV5(placeholderData);
      }
      


      const formattedAddress = address.toLowerCase();             // Convert the address to lowercase
      const cleanAddress = formattedAddress.replace(/^0x/, '');      // Remove the leading 0x for v5 request

      const v7DataReq = await fetch(`https://rpc.0l.fyi/v1/accounts/0x${cleanAddress}/resources`);
      const v7Data = await v7DataReq.json();
      console.log(v7Data);
      setData(v7Data);
      setMoreInfo(cleanAddress);
      

  
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
      const v5Chain = v5Data.diem_chain_id || '';  // Extracting the amount from the v5 response
      setv5ChainID(v5Chain);
      const v5Amount = v5Data.result.balances[0]?.amount || 0;  // Extracting the amount from the v5 response
      setV5Balance(v5Amount);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const v7DataExtraction = (type) => {
    return data?.find(item => item.type === type)?.data || {};
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="container">
      <a href="/">
        <Image src="/0L-logo.png" alt="0L Network" className="logo" width="83" height="40" />
      </a>
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
          <p>Authentication Key: {v7DataExtraction("0x1::account::Account").authentication_key}</p>
          
          <h2>Balance Details:</h2>
          <p>v5 Balance: {formatNumber((v5Balance * 0.000001).toFixed(6))}</p>
          <p>v7 Balance: {formatNumber((v7DataExtraction("0x1::coin::CoinStore<0x1::gas_coin::LibraCoin>").coin.value * 0.000001).toFixed(6))}</p>

          <h2>Slow Wallet:</h2>
          <p>v7 Unlocked: {formatNumber((v7DataExtraction("0x1::slow_wallet::SlowWallet").unlocked * 0.000001).toFixed(6))}</p>
          <p>v7 Transferred: {formatNumber((v7DataExtraction("0x1::slow_wallet::SlowWallet").transferred * 0.000001).toFixed(6))}</p>

          <h2>Supply Details:</h2>
          <p>v5 Total Supply: {v5SupplyInfo}</p>
          <p>v7 Total Supply: {formatNumber((supplyInfo * 0.000001).toFixed(6))}</p>

          <h2>Chain Info:</h2>
          <p>v5 Chain ID: {v5Chain}</p>
          <p>v7 Chain ID: {chainInfo.chain_id}</p>

          <p>
            <h3>
              <a target="_blank" href={`https://0l.fyi/accounts/0x${cleanAddress}/resources`}>
                See testnet resources for {cleanAddress}
              </a>
            </h3>
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
