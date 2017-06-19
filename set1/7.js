/**
 * Created by psquicciarini on 6/15/17.
 */

const aes = require('aes-js');

const decodeAESECB = (input, key, inputEnc) => {
  const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);
  const encodedKey = aes.utils.utf8.toBytes(key);
  const aesEcb = new aes.ModeOfOperation.ecb(encodedKey);
  const decryptedBytes = aesEcb.decrypt(bufferedInput);

  return aes.utils.utf8.fromBytes(decryptedBytes);
};

module.exports = decodeAESECB;