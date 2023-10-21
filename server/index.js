const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
  "685b96de0016c11587fe": 100
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, messageHash } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  //const recoverPublicKey = secp256k1.recoverPublicKey(messageHash, signature, recoveryBit);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }
  // else if(recoverPublicKey !== sender) {
  //   res.status(400).send({ message: "You are not authorized to send this transaction!" });
  // }
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
