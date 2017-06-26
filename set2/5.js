/**
 * Created by psquicciarini on 6/25/17.
 */

const qs = require('qs');

const keyGen = require('./3');
const ecb = require('../set1/7');

const cutAndPaste = {
  key: keyGen.generateRandomKey(16),
  parseQs(input) {
    return qs.parse(input);
  },
  sanitize(input) {
    return input.replace(/([&=])/g, '\$1');
  },
  profileFor(email) {
    return qs.stringify({
      email: this.sanitize(email),
      uid: 10, // static UID because that's not the point of the exercise
      role: 'user'
    }, { encode: false });
  },
  removePad(input, blockSize) {
    // assume hex buffer input
    for (let i = 1; i < blockSize; i += 1) {
      if (input.slice(-i).equals(Buffer.alloc(i).fill(i))) {
        return input.slice(0, -i);
      }
    }
    return input;
  },
  generateEncodedProfile(email) {
    const profile = this.profileFor(email);
    return ecb.encrypt(profile, this.key, 'utf8', 'hex');
  },
  decodeEncryptedProfile(input) {
    const bufferedInput = Buffer.from(input, 'hex');
    const decodedProfile = Buffer.from(ecb.decrypt(bufferedInput, this.key, null, null, true), 'hex');
    const unpaddedProfile = this.removePad(decodedProfile, 16).toString();
    const parsedProfile = qs.parse(unpaddedProfile);
    if (parsedProfile.uid) { // account for string and number funkiness
      parsedProfile.uid = parseInt(parsedProfile.uid, 10);
    }
    return parsedProfile;
  }
};

module.exports = cutAndPaste;
