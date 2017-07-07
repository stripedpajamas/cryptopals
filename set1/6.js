/**
 * Created by psquicciarini on 6/14/17.
 */

const one = require('./1');
const three = require('./3');
const five = require('./5');

module.exports = {
  hammingDistance(input1, input2, enc) {
    const bufferedInput1 = Buffer.from(input1, enc);
    const bufferedInput2 = Buffer.from(input2, enc);

    const length = bufferedInput1.length;
    let output = 0;
    for (let i = 0; i < length; i += 1) {
      output += (bufferedInput1[i] ^ bufferedInput2[i]).toString(2).split('').reduce((t, e) => +t + +e, 0);
    }

    return output;
  },
  guessKeySize(input, enc) {
    const bufferedInput = Buffer.from(input, enc);
    const keySizes = [];
    for (let i = 2; i <= 50; i += 1) { // trying keysizes from 2 to 50
      const slices = [];
      for (let j = 0, k = 0; j <= 4; j += 1, k += i) { // take five slices of keysize length
        slices[j] = bufferedInput.slice(k, k + i);
      }
      const hd1 = this.hammingDistance(slices[0], slices[1], 'hex') / i;
      const hd2 = this.hammingDistance(slices[1], slices[2], 'hex') / i;
      const hd3 = this.hammingDistance(slices[2], slices[3], 'hex') / i; // normalize hamming distance
      const hd4 = this.hammingDistance(slices[3], slices[4], 'hex') / i; // by dividing by keysize

      // average out the four slices
      keySizes.push({ keySize: i, normalizedHd: (hd1 + hd2 + hd3 + hd4) / 4 });
    }

    keySizes.sort((a, b) => a.normalizedHd - b.normalizedHd); // sort by smallest hd
    return keySizes.slice(0, 5).map(obj => obj.keySize); // the top 5 likely key sizes
  },
  crackRepeatingXOR(input) {
    // input starts as base64
    const hexInput = one.b64ToHex(input);
    const likelyKeysizes = this.guessKeySize(hexInput, 'hex');
    const bufferedInput = Buffer.from(hexInput, 'hex');
    const possibleDecrypted = [];

    likelyKeysizes.forEach((keysize) => {  // for each possibility --
      const length = bufferedInput.length;
      const blockInput = [];
      for (let i = 0, j = 0; i < length; i += keysize, j += 1) { // break input into keysize blocks
        blockInput[j] = Buffer.alloc(keysize);
        bufferedInput.copy(blockInput[j], 0, i, i + keysize);
      }

      const transposeBlockSize = Math.ceil(length / keysize);
      const transposedInputArr = [];

      // transpose input into blocks of just 1st byte of each block, just 2nd etc
      for (let i = 0; i < keysize; i += 1) {
        transposedInputArr[i] = Buffer.alloc(transposeBlockSize);
        for (let j = 0; j < transposeBlockSize; j += 1) {
          transposedInputArr[i][j] = blockInput[j][i];
        }
      }

      const keyArr = [];
      transposedInputArr.forEach((ciphertext) => { // pass those to 3's single-key xor cracker
        const likelyPlaintext = three.findLikelyPlaintext(ciphertext);
        keyArr.push(likelyPlaintext.key);
      });
      const bufferedKey = Buffer.from(keyArr); // put all the keys together to have the finished key
      const plaintext = Buffer.from(five(bufferedInput, bufferedKey), 'hex').toString('ascii');
      possibleDecrypted.push({
        key: keyArr.map(code => String.fromCharCode(code)).join(''),
        plaintext,
        score: three.analyzeFreq(plaintext),
      });
    });

    possibleDecrypted.sort((a, b) => a.score - b.score);
    const winner = possibleDecrypted[0];
    delete winner.score;
    return winner;
  },
};
