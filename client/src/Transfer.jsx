import { useState } from "react";
import server from "./server";
import {utf8ToBytes, toHex} from 'ethereum-cryptography/utils'
import {secp256k1 as secp} from "ethereum-cryptography/secp256k1"
import {keccak256} from "ethereum-cryptography/keccak"

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    console.log('sending from frontend............')

    const payload =  {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    }

    const _signedPayLoad = signTransaction(payload);

    const signature = {
      r: _signedPayLoad.r.toString(),
      s: _signedPayLoad.s.toString(),
      recovery: _signedPayLoad.recovery.toString(),
      recoverPublicKey: _signedPayLoad.recoverPublicKey.toString(),
    };

    console.log('_signedPayload:',
    {
         sender: address,
         amount: parseInt(sendAmount),
          recipient,
          hashedMessage:hashMsg(payload),
           signature:signature,
         }
   )

       const  _payload= {
        sender: address,
        amount: parseInt(sendAmount),
         recipient,
         hashedMessage:hashMsg(payload),
         signature:signature ,
        }
    //commented for testing
    
    try {
      const {
        data: { balance },
      } = await server.post(`/send`,_payload );
      setBalance(balance);
    } catch (ex) {
      console.log('error',ex)
      alert(ex.response.data.message);
    }

  }

  function hashMsg(payload) {
    const _bytes = utf8ToBytes(JSON.stringify(payload))
    const _hash = keccak256(_bytes)
    const _inHex = toHex(_hash)
    return _inHex
  }

  const signTransaction=(payload)=>{
    

const hashed_msg = hashMsg(payload)

console.log("hash: ", hashMsg(payload))

const signed = secp.sign(hashed_msg, privateKey);
console.log('signed payload:', signed)

return signed;

  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
