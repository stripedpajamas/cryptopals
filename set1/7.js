/**
 * Created by psquicciarini on 6/15/17.
 */

const aes = require('aes-js');
const padder = require('../set2/1');

const ecb = {
  encrypt(input, key, inputEnc, keyEnc) {
    const bufferedInput = padder(Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc), null, 16, true);
    let encodedKey;
    if (!Buffer.isBuffer(key)) {
      encodedKey = keyEnc === 'utf8' ? aes.utils.utf8.toBytes(key) : aes.utils.hex.toBytes(key);
    } else {
      encodedKey = key;
    }
    const aesEcb = new aes.ModeOfOperation.ecb(encodedKey);
    const encryptedBytes = aesEcb.encrypt(bufferedInput);

    return aes.utils.hex.fromBytes(encryptedBytes);
  },
  decrypt(input, key, inputEnc, keyEnc, returnHex) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);
    let encodedKey;
    if (!Buffer.isBuffer(key)) {
      encodedKey = keyEnc === 'utf8' ? aes.utils.utf8.toBytes(key) : aes.utils.hex.toBytes(key);
    } else {
      encodedKey = key;
    }
    const aesEcb = new aes.ModeOfOperation.ecb(encodedKey);
    const decryptedBytes = aesEcb.decrypt(bufferedInput);

    if (returnHex) {
      return aes.utils.hex.fromBytes(decryptedBytes);
    }
    return aes.utils.utf8.fromBytes(decryptedBytes);
  }
};

module.exports = ecb;