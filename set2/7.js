/**
 * Created by psquicciarini on 6/30/17.
 */

const padCheck = {
  removePad(input, inputEnc, blockSize) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);
    for (let i = 1; i <= blockSize; i += 1) {
      if (bufferedInput.slice(-i).equals(Buffer.alloc(i).fill(i))) {
        return bufferedInput.slice(0, -i).toString();
      }
    }
    throw new Error('Invalid pad');
  },
};

module.exports = padCheck;
