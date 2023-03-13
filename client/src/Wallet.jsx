import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0xa40f11c177e7ed5e1ebec3aaf799cee15ca9b5a4a7498867dfe29123737624b4" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
