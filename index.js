import active_stamp from "./activate_stamp";
import create_user from "./create_user";
import confirm_receive from "./confirm_receive";
import create_permission from "./create_permission";
import assign_role from "./assign_role";
import revoke_role from "./revoke_role";
import dummy from "./dummy";
import assign_fruit_type_product_category from "./assign_fruit_type_product_category";
import revoke_fruit_type_product_category from "./revoke_fruit_type_product_category";
import { wrapTransactionsToBatchAndSubmit } from "./TransactionHandleUtils";

const { protobuf } = require("sawtooth-sdk");

import * as sawtoothUtils from "./utils/sawtooth-utils";

 createRandomOperator();
// createPermission();
// createUser();
// assignRole();
// revokeRole();
// assignFruitTypeProductCategory();
// revokeFruitTypeProductCategory();
// sendDummy();

function makeid(len) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function createRandomOperator() {
  const NUMOFTRANSACTIONPERBATCH = process.env.TX || 1;
  const NUMOFBATCH = process.env.BATCH || 1;
  for (let i = 0; i < NUMOFBATCH; i++) {
    var txs = [];

    for (let j = 0; j < NUMOFTRANSACTIONPERBATCH; j++) {
      const tp = makeid(66 - 13) + Date.now();
      console.log(tp);
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
}

function createUser() {
  const tx_bytes = create_user.generateTransaction({
    userPublicAddress:
      "021feba74e4294d6d69764c1a58a815de8dd545dd26a116ef6d4f248d2913c57c2",
    userName: "Dat",
    roleType: [sawtoothUtils.protoBuf.Account.RoleType.OPERATOR],
    fruitTypeIds: [],
    productCategoryIds: []
  });
  wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);
}

function createPermission() {
  const tx_bytes = create_permission.generateTransaction({
    permissionPublicAddress:
      "027f157c4a258e663fe4ffb63f3f92daea4367b44d85d947346804b16625448439",
    permissionTypes: [sawtoothUtils.protoBuf.Permission.PermissionType.BACKEND]
  });
  wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);
}

//TODO:
function assignRole() {
  const tx_bytes = assign_role.generateTransaction({
    userPublicAddress:
      "021feba74e4294d6d69764c1a58a815de8dd545dd26a116ef6d4f248d2913c57c2",
    roleTypes: [
      sawtoothUtils.protoBuf.Account.RoleType.PRODUCER,
      sawtoothUtils.protoBuf.Account.RoleType.DISTRIBUTOR
    ]
  });
  wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);
}

//TODO:
function revokeRole() {
  const tx_bytes = revoke_role.generateTransaction({
    userPublicAddress:
      "021feba74e4294d6d69764c1a58a815de8dd545dd26a116ef6d4f248d2913c57c2",
    roleTypes: [
      sawtoothUtils.protoBuf.Account.RoleType.PRODUCER,
      sawtoothUtils.protoBuf.Account.RoleType.DISTRIBUTOR
    ]
  });
  wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);
}

//TODO:
function assignFruitTypeProductCategory() {
  const tx_bytes = assign_fruit_type_product_category.generateTransaction({
    userPublicAddress:
      "021feba74e4294d6d69764c1a58a815de8dd545dd26a116ef6d4f248d2913c57c2",
    typeOfFruitIds: ["f1", "f2", "f3"],
    productCategoryIds: ["p1", "p2", "p3"]
  });
  wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);
}

//TODO:
function revokeFruitTypeProductCategory() {
  const tx_bytes = revoke_fruit_type_product_category.generateTransaction({
    userPublicAddress:
      "021feba74e4294d6d69764c1a58a815de8dd545dd26a116ef6d4f248d2913c57c2",
    typeOfFruitIds: ["f1", "f2", "f3"],
    productCategoryIds: ["p1", "p2", "p3s"]
  });
  wrapTransactionsToBatchAndSubmit([
    protobuf.Transaction.decode(Buffer.from(tx_bytes))
  ]);
}

function sendDummy() {
  const NUMOFTRANSACTIONPERBATCH = process.env.TX || 1;
  const NUMOFBATCH = process.env.BATCH || 1;

  for (let i = 0; i < NUMOFBATCH; i++) {
    var txs = [];

    for (let j = 0; j < NUMOFTRANSACTIONPERBATCH; j++) {
      const tx_bytes = dummy.generateTransaction({
        randomText: makeid(30) + Date.now()
      });
      const tx = protobuf.Transaction.decode(Buffer.from(tx_bytes));
      txs.push(tx);
    }
  wrapTransactionsToBatchAndSubmit(txs);
  }
}
