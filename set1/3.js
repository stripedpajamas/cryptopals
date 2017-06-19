/**
 * Created by psquicciarini on 6/13/17.
 */

const three = {
  freqMap: { // TODO add numbers maybe
    ' ': 12705, // space is supposedly slightly more common than e
    a: 8167,
    b: 1492,
    c: 2782,
    d: 4253,
    e: 12702,
    f: 2228,
    g: 2015,
    h: 6094,
    i: 6966,
    j: 153,
    k: 772,
    l: 4025,
    m: 2406,
    n: 6749,
    o: 7507,
    p: 1929,
    q: 95,
    r: 5987,
    s: 6327,
    t: 9056,
    u: 2758,
    v: 978,
    w: 2360,
    x: 150,
    y: 1974,
    z: 74
  },
  analyzeFreq(input) {
    const inputLetterFreq = {};
    input.split('').forEach((letter) => {
      const lower = letter.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(inputLetterFreq, lower)) {
        inputLetterFreq[lower] += 1
      } else {
        inputLetterFreq[lower] = 1
      }
    });
    Object.keys(inputLetterFreq).forEach((letter) => {
      inputLetterFreq[letter] = Math.floor((inputLetterFreq[letter] / input.length) * 100000);
      if (/^[\x0a\x20-\x7e]$/.test(letter)) { // letter is normal ascii
        inputLetterFreq[letter] = this.freqMap[letter] ? Math.abs(inputLetterFreq[letter] - this.freqMap[letter]) : inputLetterFreq[letter];
      } else {
        inputLetterFreq[letter] = inputLetterFreq[letter] * 10; // bump it up because it's gross
      }
    });
    return Object.values(inputLetterFreq).reduce((t, e) => t + e, 0) / Object.keys(inputLetterFreq).length;
  },
  findWinner(input) {
    const winner = {
      key: null,
      score: Infinity
    };
    Object.keys(input).forEach((key) => {
      if (input[key].score < winner.score) {
        winner.score = input[key].score;
        winner.key = key;
      }
    });
    return winner;
  },
  findLikelyPlaintext(input, enc) {
    const bufferedInput = Buffer.isBuffer(input) ? input : Buffer.from(input, enc);
    const length = bufferedInput.length;
    const output = {};
    for (let i = 0; i <= 255; i += 1) { // all decimal ascii codes (maybe)
      const tempBuffer = Buffer.alloc(length);
      for (let j = 0; j < length; j += 1) { // iterate through buffer
        tempBuffer[j] = bufferedInput[j] ^ i; // xor each char in buffer with i
      }
      output[i] = { key: i, plaintext: tempBuffer.toString(), score: this.analyzeFreq(tempBuffer.toString()) };
    }
    const winner = output[this.findWinner(output).key];
    delete winner.score;
    return winner;
  }
};

module.exports = three;