/**
 * Created by psquicciarini on 6/20/17.
 */

const xor = require('../set1/2');
const ecb = require('../set1/7');
const padder = require('./1');

const cbc = {
  encrypt(input, key, iv, inputEnc, keyEnc) {
    const bufferedInput = padder(Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc), null, 16, true);

    // accept a buffer IV or just a character for us to repeat
    let xorTarget = Buffer.isBuffer(iv) && iv.length === 16 ? iv : Buffer.alloc(16).fill(iv);

    const output = [];
    for (let i = 0; i + 16 <= bufferedInput.length; i += 16) {
      const currentSlice = xor(bufferedInput.slice(i, i + 16), xorTarget, true);
      const currentSliceEnc = Buffer.from(ecb.encrypt(currentSlice, key, 'hex', keyEnc), 'hex');
      output.push(currentSliceEnc);
      xorTarget = currentSliceEnc;
    }
    return Buffer.concat(output, bufferedInput.length).toString('hex');
  },
  decrypt(input, key, iv, inputEnc, keyEnc) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);

    // accept a buffer IV or just a character for us to repeat
    let xorTarget = Buffer.isBuffer(iv) && iv.length === 16 ? iv : Buffer.alloc(16).fill(iv);

    const output = [];
    for (let i = 0; i + 16 <= bufferedInput.length; i += 16) {
      const ciphertextSlice = bufferedInput.slice(i, i + 16);
      const currentSliceDec = Buffer.from(ecb.decrypt(ciphertextSlice, key, 'hex', keyEnc, true), 'hex');
      const currentSliceXor = xor(currentSliceDec, xorTarget, true);
      output.push(currentSliceXor);
      xorTarget = ciphertextSlice
    }
    return Buffer.concat(output, bufferedInput.length).toString();
  }
};

module.exports = cbc;