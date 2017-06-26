/**
 * Created by psquicciarini on 6/16/17.
 */

const detectECB = {
  findDupes(input, blockSize) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, 'hex');
    const length = Buffer.byteLength(bufferedInput, 'hex');

    // ecb is deterministic, so the same plaintext chunk of 16 bytes would be encrypted into the same ciphertext chunk of 16 bytes
    // i think we can just look for any duplicate 16 byte ciphertext chunks
    const chunks = [];
    for (let i = 0, j = 0; i < length; i += blockSize, j += 1) {
      chunks[j] = Buffer.alloc(blockSize);
      bufferedInput.copy(chunks[j], 0, i, i + blockSize);
    }

    const counts = {};
    chunks.forEach((chunk) => {
      if (Object.prototype.hasOwnProperty.call(counts, chunk)) {
        counts[chunk] += 1
      } else {
        counts[chunk] = 1;
      }
    });
    return Object.keys(counts).filter((chunk) => counts[chunk] > 1).length > 0 // it is ECB
  },
  detectECBinArray(inputHaystack) {
    // expecting an array of inputs to analzye
    return inputHaystack.filter(input => this.findDupes(input, 16));
  }
}
;

module.exports = detectECB;