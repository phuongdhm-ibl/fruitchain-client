import dummy from "./dummy";
import { wrapTransactionsToBatchAndSubmit } from "./TransactionHandleUtils";

const { protobuf } = require("sawtooth-sdk");

async function main() {
  console.log(await testValidator());
}

main();

function makeid(len) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

async function testValidator() {
  // create tx
  const tx_bytes = await dummy.generateTransaction({
    randomText: makeid(30) + Date.now()
  });

  // send tx
  const batchID = await wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);

  console.log(`http://localhost:8008/batch_statuses?id=${batchID}`);

  // check tx
  const axios = require("axios");

  var promise = new Promise(function(resolve, reject) {
    let count = 0;
    let _setInterval = setInterval(async function() {
      count++;
      const res = await axios.get(
        `http://localhost:8008/batch_statuses?id=${batchID}`
      );
      console.log(res.data.data[0]);
      if (res.data.data[0].status === "COMMITTED") {
        clearInterval(_setInterval);
        resolve(true);
      }
      if (count === 20) {
        clearInterval(_setInterval);
        resolve(false);
      }
    }, 1000);
  });
  return promise;
}
