/**
 * Created by psquicciarini on 6/16/17.
 */

const pkcs7 = (input, inputEnc, blockSize, returnBuffer) => {
  const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);
  const inputLength = Buffer.byteLength(bufferedInput);

  const padLen = inputLength < blockSize ?
    blockSize - inputLength : blockSize - (inputLength % blockSize);
  const pad = Buffer.alloc(padLen || blockSize).fill(padLen || blockSize);
  const output = Buffer.concat([bufferedInput, pad]);

  return returnBuffer ? output : output.toString();
};

module.exports = pkcs7;
