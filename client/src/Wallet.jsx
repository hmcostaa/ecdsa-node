import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    try{
      const address = toHex(secp256k1.getPublicKey(privateKey)).slice(-20);
      setAddress(address);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    }
    catch(error){
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Write your private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Public Address:
        { " " + address}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
