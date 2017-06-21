/**
 * Created by psquicciarini on 6/16/17.
 */

const pkcs7 = (input, inputEnc, blockSize, returnBuffer) => {
  const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, inputEnc);
  const inputLength = Buffer.byteLength(bufferedInput);
  let outputLength;

  if (inputLength <= blockSize) {
    outputLength = blockSize;
  } else {
    outputLength = Math.ceil(inputLength / blockSize) * blockSize;
  }
  const outputBuffer = Buffer.alloc(outputLength);
  const pad = outputLength - inputLength;

  if (pad > 0) {
    bufferedInput.copy(outputBuffer, 0);
    Buffer.alloc(pad).fill(pad).copy(outputBuffer, outputLength - pad);

    return returnBuffer ? outputBuffer : outputBuffer.toString();
  }
  return input;
};

module.exports = pkcs7;