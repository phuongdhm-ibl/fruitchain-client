import * as sawtoothUtils from './utils/sawtooth-utils'

// import { toast } from 'react-toastify'
// import * as jwtDecode from 'jwt-decode'
// const checkStampUrl = `${process.env.API_URL}/v1/stamps/checkStampsToActivate`
// const token = window.localStorage.getItem('token')
// const loggedInUser = jwtDecode(token).data

const USER_PRIVATE_KEY = 'e2a182e60885fe865051b694d5be36041e0f81c346f3f93265085966487bb31f'
// const orderPosition = 13
// const orderStringLength = 20

function generateTransaction(data) {
    const context = sawtoothUtils.createContext('secp256k1')
    const userPrivateKey = USER_PRIVATE_KEY
    const privateKey = sawtoothUtils.Secp256k1PrivateKey.fromHex(userPrivateKey)
    const signer = new sawtoothUtils.CryptoFactory(context).newSigner(privateKey)

    const payloadData = {
        userPublicAddress: data.userPublicAddress,
        userName: data.userName,
        roleType: [sawtoothUtils.protoBuf.Account.RoleType.DISTRIBUTOR],
        fruitTypeIds: data.fruitTypeIds,
        productCategoryIds: data.productCategoryIds

    }

    const payload = sawtoothUtils.protoBuf.CreateAccountTransactionData.create(
        payloadData
    )

    const payloadBytes = sawtoothUtils.protoBuf.FruitchainTransactionPayload.encode({
        payloadType: sawtoothUtils.protoBuf.FruitchainTransactionPayload.PayloadType.CREATE_ACCOUNT,
        createAccount: payload
    }).finish()

    const inputs = [sawtoothUtils.calculateAddress(data.userPublicAddress)]

    const transactionHeaderBytes = sawtoothUtils.protoBuf.TransactionHeader.encode({
        familyName: sawtoothUtils.FAMILY_NAME,
        familyVersion: sawtoothUtils.FAMILY_VERSION,
        inputs,
        outputs: inputs,
        signerPublicKey: signer.getPublicKey().asHex(),
        batcherPublicKey: '027878bbcf9223c3701c25035b5454338dae4adce0da329740e2b59d96e9ab36cb',
        dependencies: (data.dep ? data.dep : []),
        payloadSha512: sawtoothUtils._hash(payloadBytes)
    }).finish()

    const signature = signer.sign(transactionHeaderBytes)
    const transaction = sawtoothUtils.protoBuf.Transaction.encode({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
    }).finish()
    const transactionBuffer = sawtoothUtils.Buffer.from(transaction)
    return transactionBuffer
}

module.exports = {
    generateTransaction
}