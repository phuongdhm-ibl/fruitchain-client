'use strict'

// const Env = use('Env')
const { protobuf } = require('sawtooth-sdk')
const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const rp = require('request-promise')

const BLOCKCHAIN_PRIVATE_KEY='af22c3fb25c24830516e553f789e7ddd7fef3f0fe68a40f723c326c2ed5fb5a1'
const SAWTOOTH_API = 'http://localhost:8008'

function parseFruitchainTransaction (rawRequest) {
  try {
    return protobuf.Transaction.decode(
      Buffer.from(
        JSON.parse(
          rawRequest
        )
      )
    )
  } catch (e) {
    console.log(e)
    throw (e)
  }
}

function wrapTransactionsToBatchAndSubmit (transactions) {
  const context = createContext('secp256k1')
  const privateKey = Secp256k1PrivateKey.fromHex(BLOCKCHAIN_PRIVATE_KEY)
  const signer = new CryptoFactory(context).newSigner(privateKey)

  // Building the batch
  // 1. Create batch header
  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature)
  }).finish()

  // 2. Create the batch
  const batchSignature = signer.sign(batchHeaderBytes)
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions
  })

  // 3. Encode the batch
  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish()

  return sentBatchToValidator(batchListBytes)
}

function sentBatchToValidator (batch) {
  return rp({
    method: 'POST',
    url: `${SAWTOOTH_API}/batches`,
    body: batch,
    headers: { 'Content-Type': 'application/octet-stream' }
  })
}

module.exports = {
  parseFruitchainTransaction,
  wrapTransactionsToBatchAndSubmit
}
