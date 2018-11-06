import active_stamp from "./activate_stamp"
import {
    wrapTransactionsToBatchAndSubmit,
} from "./TransactionHandleUtils"

const {
    protobuf
} = require('sawtooth-sdk')

import * as sawtoothUtils from './utils/sawtooth-utils'


const tx_bytes1 = active_stamp.generateTransaction({
    scannedItems: ['14ipyd3BHBq0l00000000000000000021'],
    activateDate: '2018-11-01',
    selectedBatchId: '1',
    packageStamp: '24ipyd3BHBq0l00000000000000000001',
    productId: '1',
    fruitTypeId: 'BHBq0l',
})
const tx1 = protobuf.Transaction.decode(Buffer.from(tx_bytes1))
const tx1_id = tx1.headerSignature

const header1 = protobuf.TransactionHeader.decode(tx1.header)
// console.log(header1);
// console.log(tx1_id)

const tx_bytes2 = active_stamp.generateTransaction({
    scannedItems: ['14ipyd3BHBq0l00000000000000000022'],
    activateDate: '2018-11-01',
    selectedBatchId: '1',
    packageStamp: '24ipyd3BHBq0l00000000000000000002',
    productId: '1',
    fruitTypeId: 'BHBq0l',
    dep: [tx1_id]
})

const tx2 = protobuf.Transaction.decode(Buffer.from(tx_bytes2))

const header2 = protobuf.TransactionHeader.decode(tx2.header)
// console.log(header2);
console.log(tx2.headerSignature)

// console.log(tx)
// console.log("\n\n");
// const payload = tx.payload;
// // console.log(payload)

// const header_bytes = tx.header;
// const header = protobuf.TransactionHeader.decode(header_bytes)
// console.log(header)
// wrapTransactionsToBatchAndSubmit([tx]);
// wrapTransactionsToBatchAndSubmit([tx1])