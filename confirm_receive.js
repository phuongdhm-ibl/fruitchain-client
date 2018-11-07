import * as sawtoothUtils from './utils/sawtooth-utils'


const USER_PRIVATE_KEY = 'fa22fc480e49c43e5205b1d3f360d41b85e5d0f2de36481264e649f6fc9c8f36'


function generateTransaction(orderDetail, scannedStamps) {
    // create privatekey & signer
    const context = sawtoothUtils.createContext('secp256k1');
    const userPrivateKey = USER_PRIVATE_KEY
    const privateKey = sawtoothUtils.Secp256k1PrivateKey.fromHex(userPrivateKey);
    const signer = new sawtoothUtils.CryptoFactory(context).newSigner(privateKey);

    console.log(orderDetail);
    // create payload in byte
    const payloadData = {
        deliveryId: orderDetail.id.toString(),
        packageStampIds: scannedStamps.map(stamp => {
            return stamp.code;
        }),
    };
    const payload = sawtoothUtils.protoBuf.ReceiveTransactionData.create(
        payloadData,
    );

    // console.log("payloadissssssssss::::::::", payload);
    
    const payloadBytes = sawtoothUtils.protoBuf.FruitchainTransactionPayload.encode({
        payloadType: sawtoothUtils.protoBuf.FruitchainTransactionPayload.PayloadType.RECEIVE,
        receive: payload,
    }).finish();
    // return null;

    // Generate inputs/outputs
    let inputs = [
        // Signer
        sawtoothUtils.calculateDeliveryAddress(orderDetail.id.toString()),
        sawtoothUtils.calculateAddress(signer.getPublicKey().asHex()),
    ];


    let outputs = [];

    scannedStamps.forEach(item => {
        let address = sawtoothUtils.calculateStampAddress(item.code);
        inputs.push(address);
        outputs.push(address);
    });
    // console.log("INPUT IS::: ", inputs)
    // console.log("OUTPUT IS:::: ", outputs)


    // create header
    const transactionHeaderBytes = sawtoothUtils.protoBuf.TransactionHeader.encode({
        familyName: sawtoothUtils.FAMILY_NAME,
        familyVersion: sawtoothUtils.FAMILY_VERSION,
        inputs,
        outputs,
        signerPublicKey: signer.getPublicKey().asHex(),
        batcherPublicKey: '027878bbcf9223c3701c25035b5454338dae4adce0da329740e2b59d96e9ab36cb',
        dependencies: [],
        payloadSha512: sawtoothUtils._hash(payloadBytes),
        nonce: "213"
    }, ).finish();

    // create transaction
    const signature = signer.sign(transactionHeaderBytes);
    const transaction = sawtoothUtils.protoBuf.Transaction.encode({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes,
    }).finish();

    const transactionBuffer = sawtoothUtils.Buffer.from(transaction);
    return transactionBuffer;
}
module.exports = {
    generateTransaction
}