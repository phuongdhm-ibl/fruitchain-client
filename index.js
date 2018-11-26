import active_stamp from "./activate_stamp";
import create_user from "./create_user";
import confirm_receive from "./confirm_receive";
import { wrapTransactionsToBatchAndSubmit } from "./TransactionHandleUtils";

// import * as sawtoothUtils from './utils/sawtooth-utils'

const { protobuf } = require("sawtooth-sdk");

import * as sawtoothUtils from "./utils/sawtooth-utils";

var txs = [];

for (let i = 50000; i < 50010; i++) {
  let tp = i.toString();
  while (tp.length < 66) tp += "b";
  // console.log(tp)
  // console.log(sawtoothUtils._hash(Math.random()));
  const tx_bytes = create_user.generateTransaction({
    userPublicAddress: tp,
    userName: "wutbuiii",
    fruitTypeIds: ["X4VMBTe"],
    productCategoryIds: ["1"]
  });
  const tx = protobuf.Transaction.decode(Buffer.from(tx_bytes));
  console.log(tx.headerSignature);
  const header_bytes = tx.header;
  const header = protobuf.TransactionHeader.decode(header_bytes);
  //wrapTransactionsToBatchAndSubmit(txs)
  txs.push(tx);
}

wrapTransactionsToBatchAndSubmit(txs);
// const tx_bytes = confirm_receive.generateTransaction({
//             id: 'f~ZFxUmAE8gh5W'
//         },
//     [{code:"2ODn6zSX4VMBT00000000000000000007"}]
// )
