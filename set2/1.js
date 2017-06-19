/**
 * Created by psquicciarini on 6/16/17.
 */

const pkcs7 = (input, inputEnc, blockSize) => {
  const bufferedInput = Buffer.from(input, inputEnc);
  const outputBuffer = Buffer.alloc(blockSize);
  const inputLength = Buffer.byteLength(bufferedInput);

  const pad = blockSize - inputLength;

  if (pad > 0) {
    bufferedInput.copy(outputBuffer, 0);
    Buffer.alloc(pad).fill(pad).copy(outputBuffer, blockSize - pad);

    return outputBuffer.toString();
  }
  return input;
};

module.exports = pkcs7;