import * as sawtoothUtils from "./utils/sawtooth-utils";

const BATCH_SIGNER_PUBLIC_KEY =
  "027878bbcf9223c3701c25035b5454338dae4adce0da329740e2b59d96e9ab36cb";
const USER_PRIVATE_KEY =
  "e2a182e60885fe865051b694d5be36041e0f81c346f3f93265085966487bb31f";

function generateTransaction(data) {
  const context = sawtoothUtils.createContext("secp256k1");
  const userPrivateKey = USER_PRIVATE_KEY;
  const privateKey = sawtoothUtils.Secp256k1PrivateKey.fromHex(userPrivateKey);
  const signer = new sawtoothUtils.CryptoFactory(context).newSigner(privateKey);

  const payloadData = Object.assign(data);
  const payload = sawtoothUtils.protoBuf.ModifyFruitTypeProductCategoryTransactionData.create(
    payloadData
  );

  const payloadBytes = sawtoothUtils.protoBuf.FruitchainTransactionPayload.encode(
    {
      payloadType:
        sawtoothUtils.protoBuf.FruitchainTransactionPayload.PayloadType
          .ASSIGN_FRUIT_TYPE_PRODUCT_CATEGORY,
      modifyFruitTypeProductCategory: payload
    }
  ).finish();

  const inputs = [
    sawtoothUtils.calculateAddress(data.userPublicAddress),
    sawtoothUtils.calculateAddressPermission(signer.getPublicKey().asHex())
  ];

  const transactionHeaderBytes = sawtoothUtils.protoBuf.TransactionHeader.encode(
    {
      familyName: sawtoothUtils.FAMILY_NAME,
      familyVersion: sawtoothUtils.FAMILY_VERSION,
      inputs,
      outputs: inputs,
      signerPublicKey: signer.getPublicKey().asHex(),
      batcherPublicKey: BATCH_SIGNER_PUBLIC_KEY,
      dependencies: [],
      payloadSha512: sawtoothUtils._hash(payloadBytes)
    }
  ).finish();

  const signature = signer.sign(transactionHeaderBytes);
  const transaction = sawtoothUtils.protoBuf.Transaction.encode({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
  }).finish();
  const transactionBuffer = sawtoothUtils.Buffer.from(transaction);
  return transactionBuffer;
}

module.exports = {
  generateTransaction
};
