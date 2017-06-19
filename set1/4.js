/**
 * Created by psquicciarini on 6/14/17.
 */

const three = require('./3');

const findNeedle = (haystack, cb) => {
  // haystack should be an array
    const plainHaystack = {};
    haystack.forEach((input) => {
      plainHaystack[input] = { ciphertext: input };
      plainHaystack[input].plaintext = three.findLikelyPlaintext(input, 'hex').plaintext;
      plainHaystack[input].score = three.analyzeFreq(plainHaystack[input].plaintext);
    });
    const winner = plainHaystack[three.findWinner(plainHaystack).key];
    delete winner.score;
    return cb(null, winner);
};

module.exports = findNeedle;