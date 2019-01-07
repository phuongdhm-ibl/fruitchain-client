import active_stamp from "./activate_stamp";
import create_user from "./create_user";
import confirm_receive from "./confirm_receive";
import { wrapTransactionsToBatchAndSubmit } from "./TransactionHandleUtils";

// import * as sawtoothUtils from './utils/sawtooth-utils'

const { protobuf } = require("sawtooth-sdk");

import * as sawtoothUtils from "./utils/sawtooth-utils";

const NUMOFTRANSACTIONPERBATCH = process.env.TX;
const NUMOFBATCH = process.env.BATCH;

for (let i = 0; i < NUMOFBATCH; i++) {
  var txs = [];
  for (let i = 0; i < NUMOFTRANSACTIONPERBATCH; i++) {
    let j = i + Math.ceil(Math.random() * 1000000);
    j += Math.ceil(Math.random() * 1000000);
    j += Math.ceil(Math.random() * 1000000);
    j += Math.ceil(Math.random() * 1000000);
    j += Math.ceil(Math.random() * 1000000);
    let tp = j.toString();
    while (tp.length < 66) tp += "x";
    const tx_bytes = create_user.generateTransaction({
      userPublicAddress: tp,
      userName: "1",
      fruitTypeIds: ["X4VMBTe"],
      productCategoryIds: ["1"]
    });
    const tx = protobuf.Transaction.decode(Buffer.from(tx_bytes));
    // console.log(tx.headerSignature);
    // const header_bytes = tx.header;
    // const header = protobuf.TransactionHeader.decode(header_bytes);
    // console.log(tx.headerSignature);
    txs.push(tx);
  }
  wrapTransactionsToBatchAndSubmit(txs);
}
