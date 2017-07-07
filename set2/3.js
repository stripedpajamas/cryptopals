/**
 * Created by psquicciarini on 6/20/17.
 */

const cbc = require('./2');
const ecb = require('../set1/7');
const findDupes = require('../set1/8').findDupes;

const oracle = {
  generateRandomKey(length) {
    const output = Buffer.alloc(length);
    for (let i = 0; i < length; i += 1) {
      output[i] = Math.floor(Math.random() * 255);
    }
    return output;
  },
  appendPlaintext(input) {
    // assume input is a buffer

    // generate random bytes between 5 and 10 length
    const appendBefore = this.generateRandomKey(Math.floor((Math.random() * 6) + 5));
    const appendAfter = this.generateRandomKey(Math.floor((Math.random() * 6) + 5));

    const output = Buffer.alloc(input.length + appendBefore.length + appendAfter.length);
    appendBefore.copy(output, 0);
    input.copy(output, appendBefore.length);
    appendAfter.copy(output, input.length + appendBefore.length);
    return output;
  },
  randomEncrypt(input, inputEnc) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);

    // append 5-10 bytes before and after PT
    const plaintext = this.appendPlaintext(bufferedInput);

    // get random key
    const key = this.generateRandomKey(16);

    // choose ECB or CBC randomly
    if (Math.floor(Math.random() * 100) >= 50) {
      // if CBC generate a random IV
      const iv = this.generateRandomKey(16);

      // encrypt cbc mode
      return { mode: 'cbc', ciphertext: cbc.encrypt(plaintext, key, iv) };
    }
    return { mode: 'ecb', ciphertext: ecb.encrypt(plaintext, key) };
  },
  orc(input) {
    return findDupes(input, 16) ? 'ecb' : 'cbc';
  },
};

module.exports = oracle;
