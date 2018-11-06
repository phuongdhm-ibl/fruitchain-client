// Helper functions
export const {
    Buffer
  } = require('sawtooth-sdk/browserify-bundles/buffer/buffer')
  export const crypto = require('sawtooth-sdk/browserify-bundles/crypto/crypto')
  export const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
  export const {
    Secp256k1PrivateKey
  } = require('sawtooth-sdk/signing/secp256k1')
  export const protoBuf = require('./protobuf/index')
  export const FAMILY_NAME = 'fruitchain'
  export const FAMILY_VERSION = '1.0'
  
  export function _hash (x) {
    return crypto
      .createHash('sha512')
      .update(x)
      .digest('hex')
  }
  
  export function hashFamilyNamespace () {
    return _hash(FAMILY_NAME).substring(0, 6)
  }
  
  export function calculateAddress (accNumber) {
    const byteArray = asBytes(accNumber.toString())
  
    const hexAddress = bytesToHexStr(_hash(Buffer.from(byteArray)))
  
    const address = `${hashFamilyNamespace()}01${hexAddress.substring(0, 62)}`
    return address
  }
  
  export function calculateFruitTypeAddress (accNumber) {
    const byteArray = asBytes(accNumber.toString())
  
    const hexAddress = bytesToHexStr(_hash(Buffer.from(byteArray)))
  
    const address = `${hashFamilyNamespace()}02${hexAddress.substring(0, 62)}`
    return address
  }
  
  export function calculateStampAddress (stampCode) {
    const byteArray = asBytes(stampCode)
    const hexAddress = bytesToHexStr(_hash(Buffer.from(byteArray)))
  
    return `${hashFamilyNamespace()}05${hexAddress.substring(0, 62)}`
  }
  
  export function calculateBatchAddress (batchId) {
    const byteArray = asBytes(batchId)
  
    const hexAddress = bytesToHexStr(_hash(Buffer.from(byteArray)))
  
    return `${hashFamilyNamespace()}04${hexAddress.substring(0, 62)}`
  }
  
  export function calculateProductCategoryAddress (productCategoryId) {
    const byteArray = asBytes(productCategoryId)
    const hexAddress = bytesToHexStr(_hash(Buffer.from(byteArray)))
  
    return `${hashFamilyNamespace()}03${hexAddress.substring(0, 62)}`
  }
  
  export function calculateDeliveryAddress (deliveryId) {
    const byteArray = asBytes(deliveryId)
    const hexAddress = bytesToHexStr(_hash(Buffer.from(byteArray)))
  
    return `${hashFamilyNamespace()}06${hexAddress.substring(0, 62)}`
  }
  
  export function asBytes (str) {
    let byteArray = []
    for (let i = 0; i < str.length; ++i) {
      const y = str.charCodeAt(i)
      byteArray = byteArray.concat([y])
    }
    return byteArray
  }
  
  export function bytesToHexStr (buffer) {
    let hexStringArray = []
  
    for (let i = 0; i < buffer.length; ++i) {
      hexStringArray = hexStringArray.concat([buffer[i].toString(16)])
    }
  
    const hexAddress = hexStringArray.join('').toString()
    return hexAddress
  }
  