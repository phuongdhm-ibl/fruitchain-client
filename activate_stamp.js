// /**
//  * Gets the repositories of the user from Github
//  */

// import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
// import {
//   LOAD_BATCH_LIST,
//   ON_SCAN_ADDED_ITEM,
//   ON_SCAN_ADDING_ITEM,
//   ON_SCAN_BY_RANGE,
//   ON_SCAN_BY_RANGE_SUCCESS,
//   ON_SCAN_PACKAGE_SUCCESS,
//   ON_NEXT_PACKED,
//   ON_NEXT_PACKED_SUCCESS,
//   CLEAR_STAMP_RANGE
// } from './constants'

// import {
//   batchListLoaded,
//   batchListLoadingError,
//   onAddedStamp
// } from './actions'

// import { request, requestFull } from 'utils/request'



import * as sawtoothUtils from './utils/sawtooth-utils'

// import { toast } from 'react-toastify'
// import * as jwtDecode from 'jwt-decode'
// const checkStampUrl = `${process.env.API_URL}/v1/stamps/checkStampsToActivate`
// const token = window.localStorage.getItem('token')
// const loggedInUser = jwtDecode(token).data

const USER_PRIVATE_KEY = '83002ab289212cab4c941c79a6460194c6682ce262c25066f39523cd869b359b'
// const orderPosition = 13
// const orderStringLength = 20


function generateTransaction (data) {
    // create privatekey & signer
    const context = sawtoothUtils.createContext('secp256k1')
    const userPrivateKey = USER_PRIVATE_KEY
    const privateKey = sawtoothUtils.Secp256k1PrivateKey.fromHex(userPrivateKey) // sawtoothUtils.Secp256k1PrivateKey.newRandom();
    const signer = new sawtoothUtils.CryptoFactory(context).newSigner(privateKey)
  
    // create payload in byte
    let packages = []
    const productIds = data.scannedItems
  
    const payloadData = {
      activeDate: data.activateDate,
      batchFruitId: data.selectedBatchId,
      productIds: null,
      packages: null
    }
  
    if (data.packageStamp !== '') {
      packages = [
        sawtoothUtils.protoBuf.ActiveStampTransactionData.ActiveStampPackage.create(
          {
            packageId: data.packageStamp,
            productIds
          }
        )
      ]

      // console.log("***",packages)
      // console.log("***",packages[0])
  
      payloadData.packages = packages
    } else {
      payloadData.productIds = productIds
    }
  
    const payload = sawtoothUtils.protoBuf.ActiveStampTransactionData.create(
      payloadData
    )
  
    const payloadBytes = sawtoothUtils.protoBuf.FruitchainTransactionPayload.encode(
      {
        payloadType:
          sawtoothUtils.protoBuf.FruitchainTransactionPayload.PayloadType
            .ACTIVE_STAMPS,
        activeStamp: payload
      }
    ).finish()
  
    // Generate inputs/outputs
    const inputs = [
      // Signer
      sawtoothUtils.calculateAddress(signer.getPublicKey().asHex()),
  
      // batch fruit
      sawtoothUtils.calculateBatchAddress(data.selectedBatchId),
  
      // product category
      sawtoothUtils.calculateProductCategoryAddress(data.productId),
  
      // fruit type
      sawtoothUtils.calculateFruitTypeAddress(data.fruitTypeId)
    ]
  
    // product stamps
    productIds.forEach(id => {
      inputs.push(sawtoothUtils.calculateStampAddress(id))
    })
  
    if (packages.length > 0) {
      inputs.push(sawtoothUtils.calculateStampAddress(data.packageStamp))
    }
  
    // create header
    const transactionHeaderBytes = sawtoothUtils.protoBuf.TransactionHeader.encode(
      {
        familyName: sawtoothUtils.FAMILY_NAME,
        familyVersion: sawtoothUtils.FAMILY_VERSION,
        inputs,
        outputs: inputs,
        signerPublicKey: signer.getPublicKey().asHex(),
        batcherPublicKey:
          '027878bbcf9223c3701c25035b5454338dae4adce0da329740e2b59d96e9ab36cb',
        dependencies: (data.dep ? data.dep: []),
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


  module.exports = {
    generateTransaction
  }