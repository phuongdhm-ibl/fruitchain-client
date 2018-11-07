import * as sawtoothUtils from './utils/sawtooth-utils'
import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'

import { request, requestFull } from 'utils/request'
import * as sawtoothUtils from 'utils/sawtooth-utils'
import { toast } from 'react-toastify'
import nanoid from 'nanoid'

// const token = window.localStorage.getItem('token')

const USER_PRIVATE_KEY = 'e2a182e60885fe865051b694d5be36041e0f81c346f3f93265085966487bb31f'

function * generateTransaction (data) {
  // create privatekey & signer
  const context = sawtoothUtils.createContext('secp256k1')
  const userPrivateKey = USER_PRIVATE_KEY
  const privateKey = sawtoothUtils.Secp256k1PrivateKey.fromHex(userPrivateKey)
  const signer = new sawtoothUtils.CryptoFactory(context).newSigner(privateKey)

  // create payload in byte
  let payloadData = data.deliveryOrder
  payloadData.deliveryId = nanoid(20)
  const payload = sawtoothUtils.protoBuf.CreateDeliveryTransactionData.create(payloadData)

  const payloadBytes = sawtoothUtils.protoBuf.FruitchainTransactionPayload.encode(
    {
      payloadType:
      sawtoothUtils.protoBuf.FruitchainTransactionPayload.PayloadType.CREATE_DELIVERY,
      createDelivery: payload
    }
  ).finish()

  // Generate inputs/outputs
  const inputs = [
    // Signer
    sawtoothUtils.calculateDeliveryAddress(data.deliveryOrder.deliveryId),
    sawtoothUtils.calculateAddress(signer.getPublicKey().asHex()),
    sawtoothUtils.calculateAddress(data.selectedReceiver.public_key)
  ]

  data.deliveryOrder.orderDetails.forEach(item => {
    inputs.push(sawtoothUtils.calculateFruitTypeAddress(item.fruitTypeId))
    inputs.push(sawtoothUtils.calculateProductCategoryAddress(item.productCategoryId))

    item.packageStampIds.forEach(stamp => {
      inputs.push(sawtoothUtils.calculateStampAddress(stamp))
    })
  })

  // create header
  const transactionHeaderBytes = sawtoothUtils.protoBuf.TransactionHeader.encode(
    {
      familyName: sawtoothUtils.FAMILY_NAME,
      familyVersion: sawtoothUtils.FAMILY_VERSION,
      inputs,
      outputs: inputs,
      signerPublicKey: signer.getPublicKey().asHex(),
      batcherPublicKey: '027878bbcf9223c3701c25035b5454338dae4adce0da329740e2b59d96e9ab36cb',
      dependencies: [],
      payloadSha512: sawtoothUtils._hash(payloadBytes)
    }
  ).finish()

  // create transaction
  const signature = signer.sign(transactionHeaderBytes)
  const transaction = sawtoothUtils.protoBuf.Transaction.encode({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
  }).finish()

  const transactionBuffer = sawtoothUtils.Buffer.from(transaction)
  return transactionBuffer
}