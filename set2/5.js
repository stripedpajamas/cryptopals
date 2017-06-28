/**
 * Created by psquicciarini on 6/25/17.
 */

const qs = require('qs');

const keyGen = require('./3');
const four = require('./4')();
const ecb = require('../set1/7');

const cutAndPaste = {
  key: keyGen.generateRandomKey(16),
  parseQs(input) {
    return qs.parse(input);
  },
  sanitize(input) {
    return input && input.replace(/([&=])/g, '\\$1');
  },
  profileFor(email) {
    return qs.stringify({
      email: this.sanitize(email),
      uid: Math.floor((Math.random() * 89) + 10), // should be between 10 and 99 for testing
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
    if (!email) throw new Error('Email address required.');
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
  },
  findBlockSize(encFunc) {
    let i = 1;
    let blockGuess = 0;
    let currentSize = 0;
    while (blockGuess < 1 && i <= 256) {
      const currentCT = Buffer.from(encFunc.call(this, 'A'.repeat(i)), 'hex');
      if (currentCT.length > currentSize && currentSize > 0) {
        return currentCT.length - currentSize;
      }
      currentSize = currentCT.length;
      i += 1;
    }
    return blockGuess;
  },
  createAdminProfile() {
    // find blocksize first
    const blockSize = 16; // this.findBlockSize(this.generateEncodedProfile);

    // get admin plus a bunch of 11s (16-5 = 11):
    const adminDiffLength = blockSize - 5;
    const adminRolePayload = `admin${`${String.fromCharCode(adminDiffLength).repeat(adminDiffLength)}`}`;

    // need to position the arp so that it gets a block of its own
    // which means email=something needs to be exactly blocksize
    const prePayloadLength = blockSize - 6; // email=
    const prePayload = 'A'.repeat(prePayloadLength);

    // encrypt once to get the encrypted admin payload
    const encryptedWithAdmin = Buffer.from(this.generateEncodedProfile(`${prePayload}${adminRolePayload}`), 'hex');

    // we need to slice out just the encrypted admin role payload section
    // which would be block 2
    const encAdminBlock = encryptedWithAdmin.slice(blockSize, blockSize * 2);

    // now we generate a profile that has the role all by itself in the last block
    // email=a&uid=XX&role=user -> 13 on the right hand side, 6 on the left
    // need to make it add up to a multiple of the blocksize
    let pusherPayloadLength = 1;
    while ((pusherPayloadLength + 19) % blockSize) {
      pusherPayloadLength += 1;
    }
    const pusherPayload = 'A'.repeat(pusherPayloadLength);
    const adminProfile = Buffer.from(this.generateEncodedProfile(pusherPayload), 'hex');

    // now we just need to swap the last block with encAdminBlock
    encAdminBlock.copy(adminProfile, adminProfile.length - blockSize);

    // pass our new profile to the decode function
    return this.decodeEncryptedProfile(adminProfile);
  }
};

module.exports = cutAndPaste;