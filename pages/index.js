
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
          <h2>Jail Information</h2>
          <p>Is Jailed: {String(extractData("0x1::jail::Jail").is_jailed)}</p>
          <p>Lifetime Vouchees Jailed: {extractData("0x1::jail::Jail").lifetime_vouchees_jailed}</p>

          <h2>Account Details</h2>
          <p>Sequence Number: {extractData("0x1::account::Account").sequence_number}</p>
          <p>Authentication Key: {extractData("0x1::account::Account").authentication_key}</p>

          <h2>Validator Details</h2>
          <p>Consensus Public Key: {extractData("0x1::stake::ValidatorConfig").consensus_pubkey}</p>
          <p>Validator Index: {extractData("0x1::stake::ValidatorConfig").validator_index}</p>

          <h2>Balance</h2>
          <p>Current Balance: {extractData("0x1::coin::CoinStore<0x1::gas_coin::LibraCoin>").coin.value}</p>

          <h2>Tower State</h2>
          <p>Contiguous Epochs Mining: {extractData("0x1::tower_state::TowerProofHistory").contiguous_epochs_mining}</p>
          <p>Epochs Mining: {extractData("0x1::tower_state::TowerProofHistory").epochs_mining}</p>
          <p>Latest Epoch Mining: {extractData("0x1::tower_state::TowerProofHistory").latest_epoch_mining}</p>

          <h2>Slow Wallet</h2>
          <p>Transferred: {extractData("0x1::slow_wallet::SlowWallet").transferred}</p>
          <p>Unlocked: {extractData("0x1::slow_wallet::SlowWallet").unlocked}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
