/**
 * Created by psquicciarini on 6/13/17.
 */

module.exports = {
  hexToB64(input) {
    const bufferedInput = Buffer.from(input, 'hex');
    return bufferedInput.toString('base64');
  },
  b64ToHex(input) {
    const bufferedInput = Buffer.from(input, 'base64');
    return bufferedInput.toString('hex');
  }
};