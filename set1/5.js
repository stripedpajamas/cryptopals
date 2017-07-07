/**
 * Created by psquicciarini on 6/14/17.
 */

const repeatingKeyXOR = (input, key, enc) => {
  const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, enc);
  const bufferedKey = Buffer.isBuffer(key) ? key : Buffer.from(key, enc);
  const inputLength = bufferedInput.length;
  const keyLength = bufferedKey.length;

  const output = Buffer.alloc(inputLength);
  for (let i = 0; i < inputLength; i += 1) {
    output[i] = bufferedInput[i] ^ bufferedKey[i % keyLength];
  }

  return output.toString('hex');
};

module.exports = repeatingKeyXOR;
