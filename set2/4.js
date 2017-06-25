/**
 * Created by psquicciarini on 6/23/17.
 */

const oracle = require('./3');
const ecb = require('../set1/7');
const detect = require('../set1/8');

const ecbDecryptSingleByte = (secretSauce) => ({
  key: oracle.generateRandomKey(16), // static key for testing
  encryptWithSecretSauce(input, inputEnc) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);

    const ssBuffer = Buffer.from(secretSauce, 'base64');
    const fullInput = Buffer.concat([bufferedInput, ssBuffer]);

    return ecb.encrypt(fullInput, this.key);
  },
  findBlockSize() {
    let i = 1;
    let blockGuess = 0;
    let currentSize = 0;
    while (blockGuess < 1 && i <= 256) {
      const currentCT = Buffer.from(this.encryptWithSecretSauce('A'.repeat(i)), 'hex');
      if (currentCT.length > currentSize && currentSize > 0) {
        blockGuess = currentCT.length - currentSize;
      }
      currentSize = currentCT.length;
      i += 1;
    }
    return blockGuess;
  },
  detectECB(blockSize) {
    const bs = blockSize || this.findBlockSize();
    const payload = ('A'.repeat(bs)).repeat(5); // should definitely get a dupe here
    const ciphertext = this.encryptWithSecretSauce(payload);
    return detect.findDupes(ciphertext, bs);
  },
  crack() {
    const blockSize = this.findBlockSize();
    if (!this.detectECB(blockSize)) return "Not ECB. Can't crack.";

    const secretSauceLength = (Buffer.from(this.encryptWithSecretSauce('A'.repeat(blockSize)), 'hex').length - blockSize);

    let recoveredPlaintext = '';

    for (let k = 0; k <= secretSauceLength; k += blockSize) {
      for (let j = 1; j <= blockSize; j += 1) {
        const dictionary = {};
        const payload = Buffer.from('A'.repeat(blockSize - j));
        const blockToCrack = Buffer.from(this.encryptWithSecretSauce(payload), 'hex').slice(k, k + blockSize);
        for (let i = 0; i <= 255; i += 1) {
          const currentPayload = Buffer.concat([payload, Buffer.from(recoveredPlaintext), Buffer.from(String.fromCharCode(i))]);
          const block = Buffer.from(this.encryptWithSecretSauce(currentPayload), 'hex').slice(k, k + blockSize);
          dictionary[block.toString('hex')] = i;
        }
        const match = Object.keys(dictionary).find(block => Buffer.from(block, 'hex').equals(blockToCrack));
        recoveredPlaintext += String.fromCharCode(dictionary[match]);
      }

    }
    return recoveredPlaintext;
  }
});

module.exports = ecbDecryptSingleByte;