const fs = require('fs')
const path = require( 'path')
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1")



app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, '..', 'records.json'); // The file path in the directory above the current directory
const fsLines = fs.readFileSync(filePath, 'utf8')
const balances = JSON.parse(fsLines)




const getOwnerBalance = (owner) => {
  const record = balances.find((record) => record.wallet === owner)
  return record.balance
}

const verifySender = (hashed_msg,signed)=>{
  const _signedBigIn= {
    r: BigInt(signed.r),
    s: BigInt(signed.s),
    recovery: BigInt(signed.recovery),
    recoverPublicKey:Big(signed.recoverPublicKey)
  };
  const rPublicKey = _signedBigIn.recoverPublicKey(hashed_msg).toRawBytes()

// console.log('recovered public key: ', rPublicKey)
const isVerified = secp.secp256k1.verify(_signedBigIn, hashed_msg, toHex(rPublicKey))


console.log("is it valid?: ", isVerified)
return isVerified;


}

app.get("/balance/:address", (req, res) => {
  console.log('getting balance..............')
  const { address } = req.params;
  const balance = getOwnerBalance(address) || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  console.log('sending...................')
  const { sender, recipient, amount,hashedMessage,signature } = req.body;
  console.log('backend pay road',signedPayLoad);
 console.log('verifying sender:',verifySender(hashedMessage,signature));
  setInitialBalance(sender);
  setInitialBalance(recipient);  

 if(verifySender(hashedMessage,_signedPayLoad)){
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
 }else{
  res.status(400).send({ message: "Can't verify transaction!" });
 }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  // if (!balances[address]) {
  //   balances[address] = 0;
  // }
  // // else{
  //   balances.forEach((element,index) => {
  //     console.log('single balance', index)
  //     if(element.address==address){
       
  //     }
  //   });
  // // }
 balances[address] = getOwnerBalance(address)??0

}
