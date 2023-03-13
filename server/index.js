const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const {hexToBytes, toHex, utf8ToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0xf3aa83f68070e4d588f8ab7d5f15caccf5514158f37759f55a4382015351127d": 100,
  "0xef90473df324ae17986d39cc0a8beca520a653af67402e1a6c81fb18865d674f": 50,
  "0xa40f11c177e7ed5e1ebec3aaf799cee15ca9b5a4a7498867dfe29123737624b4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {recipient, amount, signature, recoveryBit, publicKey} = req.body;

  let address = '0x' + toHex(keccak256(hexToBytes(publicKey).slice(1).slice(-20)));

  let message = {
      from: address,
      to: recipient,
      amount: amount,
  };

  const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
  const recoverKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);

  setInitialBalance(address);
  setInitialBalance(recipient);
  
  if (toHex(recoverKey) === publicKey) {
      if (balances[address] < amount) {
          res.status(400).send({message: "Not enough funds in " + address + " wallet !"});
      } else {
          balances[address] -= amount;
          balances[recipient] += amount;
          res.send({balance: balances[address]});
      }
  } else {
      res.status(400).send({message: "Not the right signature !"});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
