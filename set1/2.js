/**
 * Created by psquicciarini on 6/13/17.
 */

module.exports = (input1, input2, bufferOutput) => {
  const bufferedInput1 = Buffer.from(input1, 'hex');
  const bufferedInput2 = Buffer.from(input2, 'hex');
  const length = bufferedInput1.length;
  const output = Buffer(length);
  for (let i = 0; i < length; i += 1) {
    output[i] = bufferedInput1[i] ^ bufferedInput2[i];
  }
  return bufferOutput ? output : output.toString('hex');
};