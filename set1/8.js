/**
 * Created by psquicciarini on 6/16/17.
 */

const detectECB = (inputHaystack) => {
  // expecting an array of inputs to analzye
  output = [];
  inputHaystack.forEach((input, idx) => {
    const bufferedInput = Buffer.from(input, 'hex');
    const length = Buffer.byteLength(bufferedInput, 'hex');

    // ecb is deterministic, so the same plaintext chunk of 16 bytes would be encrypted into the same ciphertext chunk of 16 bytes
    // i think we can just look for any duplicate 16 byte ciphertext chunks
    const chunks = [];
    for (let i = 0, j = 0; i < length; i += 16, j += 1) {
      chunks[j] = Buffer.alloc(16);
      bufferedInput.copy(chunks[j], 0, i, i + 16);
    }

    const counts = {};
    chunks.forEach((chunk) => {
      if (Object.prototype.hasOwnProperty.call(counts, chunk)) {
        counts[chunk] += 1
      } else {
        counts[chunk] = 1;
      }
    });
    if (Object.keys(counts).filter((chunk) => counts[chunk] > 1).length) {
      output.push(idx);
    }
  });
  return output;
};

module.exports = detectECB;