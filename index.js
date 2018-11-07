import active_stamp from "./activate_stamp"
import create_user from "./create_user"
import confirm_receive from "./confirm_receive"
import {
    wrapTransactionsToBatchAndSubmit,
} from "./TransactionHandleUtils"

const {
    protobuf
} = require('sawtooth-sdk')

import * as sawtoothUtils from './utils/sawtooth-utils'


// const address = sawtoothUtils.calculateAddress("037f0464ac74382289193aa6ebd35f61492bed7e5f79ef8974918d2625d5e4a17e")
// console.log(address);
// console.log(sawtoothUtils.calculateStampAddress("23cIoQJwWI1Qj00000000000000000001"));
// console.log(sawtoothUtils.calculateDeliveryAddress("52"))

// const tx_bytes1 = active_stamp.generateTransaction({
//     scannedItems: ['14ipyd3BHBq0l00000000000000000021'],
//     activateDate: '2018-11-01',
//     selectedBatchId: '1',
//     packageStamp: '24ipyd3BHBq0l00000000000000000001',
//     productId: '1',
//     fruitTypeId: 'BHBq0l',
// })
// const tx1 = protobuf.Transaction.decode(Buffer.from(tx_bytes1))
// const tx1_id = tx1.headerSignature

// const header1 = protobuf.TransactionHeader.decode(tx1.header)
// console.log(header1);
// console.log(tx1_id)

// console.log(tx)
// console.log("\n\n");


// const tx_bytes = create_user.generateTransaction({
//     userPublicAddress: "0366b73cfade0d56ad462240a87defe0cb8380bd2a547be162260d4100fe0db971",
//     userName: "wutbu",
//     fruitTypeIds: ["X4VMBT"],
//     productCategoryIds: ["1"]
// })


const tx_bytes = confirm_receive.generateTransaction({
            id: 'f~ZFpgAzX7xUmAE8gh5W'
        },
    [{code:"2ODn6zSX4VMBT00000000000000000006"}]
)

// console.log(tx)


// const header_bytes = tx.header;
// const header = protobuf.TransactionHeader.decode(header_bytes)
// console.log(header)

// const payload_bytes = tx.payload;


// const payload = sawtoothUtils.protoBuf.FruitchainTransactionPayload.decode(payload_bytes)
// console.log(payload)




const tx = protobuf.Transaction.decode(Buffer.from(tx_bytes))
const header_bytes = tx.header;
const header = protobuf.TransactionHeader.decode(header_bytes)
console.log(header)
wrapTransactionsToBatchAndSubmit([tx])


// sawtooth-fruichain-tp-go | 6b7e16069c3211509a9eee80f881f6b6666ab82df6bec222c84ba583c5bb636a0a0d81
// sawtooth-fruichain-tp-go | 6b7e16012cff0dbd7f8518289c8d541daecd9d6741d290fc5056958f015e16f8e7bca6
// sawtooth-fruichain-tp-go | 6b7e16059fa180272ea7cad76cab206f3d03a008a0803fe83f9d299f9aa8943f43b441

// [ '6b7e16069c3211509a9eee80f881f6b6666ab82df6bec222c84ba583c5bb636a0a0d81',
//      '6b7e16012cff0dbd7f8518289c8d541daecd9d6741d290fc5056958f015e16f8e7bca6',
//      '6b7e16059fa180272ea7cad76cab206f3d03a008a0803fe83f9d299f9aa8943f43b441' ]

