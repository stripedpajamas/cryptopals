/**
 * Created by psquicciarini on 6/29/17.
 */

const keyGen = require('./3');
const ecb = require('../set1/7');

const ecbDecryptPadded = secretSauce => ({
  key: keyGen.generateRandomKey(16),
  // hopefully a length between 8 and 32 :)
  randomPrePad: keyGen.generateRandomKey(Math.floor((Math.random() * 25) + 8)),
  encrypt(input, inputEnc) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);

    const ssBuffer = Buffer.from(secretSauce, 'base64');
    const fullInput = Buffer.concat([this.randomPrePad, bufferedInput, ssBuffer]);

    return ecb.encrypt(fullInput, this.key);
  },
  findBlockSize(encFunc) {
    let i = 1;
    let currentSize = 0;
    while (i <= 256) {
      const currentCT = Buffer.from(encFunc.call(this, 'A'.repeat(i)), 'hex');
      if (currentCT.length > currentSize && currentSize > 0) {
        return currentCT.length - currentSize;
      }
      currentSize = currentCT.length;
      i += 1;
    }
    return 0;
  },
  findFirstDupedBlock(input, blockSize) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, 'hex');
    const length = bufferedInput.length;

    const chunks = [];
    for (let i = 0, j = 0; i < length; i += blockSize, j += 1) {
      chunks[j] = Buffer.alloc(blockSize);
      bufferedInput.copy(chunks[j], 0, i, i + blockSize);
    }
    return chunks.findIndex((chunk, idx) => chunk.equals(chunks[idx + 1] || Buffer.alloc(0)));
  },
  crack() {
    const blockSize = this.findBlockSize(this.encrypt);

    // we need to send a 4*blocksize payload to make sure we have at least two repeating blocks
    // which we can then use as a location marker
    let markerPayload = 'A'.repeat(4 * blockSize);
    let encWithMarker = Buffer.from(this.encrypt(markerPayload), 'hex');

    // find the duped block
    const dupeBlockNum = this.findFirstDupedBlock(encWithMarker, blockSize);

    let dupeBlockNumMarker = dupeBlockNum;
    // shrink input until the dupe goes away
    while (dupeBlockNumMarker >= 0 && markerPayload.length >= 0) {
      markerPayload = markerPayload.slice(0, -1);
      encWithMarker = Buffer.from(this.encrypt(markerPayload), 'hex');
      dupeBlockNumMarker = this.findFirstDupedBlock(encWithMarker, blockSize);
    }

    const marker = markerPayload.length + 1;
    const secondBlockLoc = (dupeBlockNum + 1) * blockSize;
    const length = (Buffer.from(this.encrypt('A'.repeat(blockSize)), 'hex').length - blockSize);

    let recoveredPlaintext = '';

    for (let k = secondBlockLoc; k <= length; k += blockSize) {
      for (let j = 1; j <= blockSize; j += 1) {
        const dictionary = {};
        const payload = Buffer.from('A'.repeat(marker - j));
        const blockToCrack = Buffer.from(this.encrypt(payload), 'hex').slice(k, k + blockSize);
        for (let i = 0; i <= 255; i += 1) {
          const currentPayload = Buffer.concat([
            payload,
            Buffer.from(recoveredPlaintext),
            Buffer.from(String.fromCharCode(i)),
          ]);
          const block = Buffer.from(this.encrypt(currentPayload), 'hex').slice(k, k + blockSize);
          dictionary[block.toString('hex')] = i;
        }
        const match = Object.keys(dictionary).find(block => Buffer.from(block, 'hex').equals(blockToCrack));
        recoveredPlaintext += String.fromCharCode(dictionary[match]);
      }
    }
    return recoveredPlaintext;
  },
});

module.exports = ecbDecryptPadded;
