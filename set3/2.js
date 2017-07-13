/**
 * Created by psquicciarini on 7/12/17.
 */

const xor = require('../set1/2');
const ecb = require('../set1/7');

const ctr = {
  increment(buffer, options) {
    const buf = buffer;
    if (options && options.le) {  // little endian
      let i;

      for (i = 0; i < buf.length && buf[i] === 255; i += 1) {
        buf[i] = 0;
      }
      if (~i) buf[i] += 1;
    } else { // big endian
      const len = buf.length;
      let i;

      for (i = len - 1; i >= 0 && buf[i] === 255; i -= 1) {
        buf[i] = 0;
      }
      if (~i) buf[i] += 1;
    }
    return buf;
  },
  /**
   * Process input using AES-CTR mode
   * @param input
   * @param nonce either an 8-byte Buffer or something to fill one with
   * @param key
   * @param options accepts inputEnc and le (little endian)
   */
  process(input, nonce, key, options) {
    const inputBuff = Buffer.isBuffer(input) ? input : Buffer.from(input, options.inputEnc);
    const nonceBuff = Buffer.isBuffer(nonce) && nonce.length === 8 ?
      nonce : Buffer.alloc(8).fill(nonce);
    const keyBuff = Buffer.from(key);

    const output = Buffer.alloc(inputBuff.length);
    const counter = Buffer.alloc(8).fill(0);

    // generate the keystream blocks
    for (let i = 0; i - 16 < inputBuff.length; i += 16) {
      const iv = Buffer.concat([nonceBuff, counter]);
      const ks = ecb.encrypt(iv, keyBuff);
      const processedBlock = xor(inputBuff.slice(i, i + 16), ks, true);
      processedBlock.copy(output, i);
      this.increment(counter, { le: options.le });
    }
    return output;
  },
};

module.exports = ctr;
