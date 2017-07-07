/**
 * Created by psquicciarini on 7/5/17.
 */

const cbc = require('./2');
const keyGen = require('./3');
const padCheck = require('./7');

const bitflipper = {
  key: keyGen.generateRandomKey(16),
  iv: keyGen.generateRandomKey(16),
  sanitize(input) {
    return input && input.replace(/([;=])/g, '\\$1');
  },
  encrypt(input) {
    const prepend = Buffer.from(encodeURI('comment1=cooking MCs;userdata='));
    const append = Buffer.from(encodeURI(';comment2= like a pound of bacon'));
    const cleanInput = Buffer.from(encodeURI(this.sanitize(input)));

    const fullInput = Buffer.concat([prepend, cleanInput, append]);

    return cbc.encrypt(fullInput, this.key, this.iv);
  },
  decrypt(input) {
    const decrypted = cbc.decrypt(input, this.key, this.iv, 'hex');
    return padCheck.removePad(decrypted, 'utf8', 16);
  },
  checkAdmin(input) {
    const plain = this.decrypt(input);
    const profile = plain.split(';');
    const profileObj = profile.reduce((t, e) => {
      const split = e.split('=');
      const newt = t;
      newt[split[0]] = split[1];
      return newt;
    }, {});
    return Object.hasOwnProperty.call(profileObj, 'admin') && profileObj.admin === 'true';
  },
  makeAdmin() {
    // because comment1=cooking%20MCs;userdata= is 32 bytes long, my input begins block 3 always
    // i need to get ;admin=true in my block
    // i know that block 2 will be xor'd with my block
    // block 2 is %20MCs;userdata=
    // A = block 2 char
    // X = plaintext I enter
    // Z = letter I want
    // set A to AxXxZ
    const payload = 'A'.repeat(16);
    let enc = Buffer.from(this.encrypt(payload), 'hex');
    const adminPayload = Buffer.from(';admin=true');

    for (let i = 0; i < adminPayload.length; i += 1) {
      // i want the last 11 chars of my block to be my admin payload
      // so starting at 48 - 11 = 37
      // and I need to edit the 2nd block to make changes to the 3rd so - 16
      // 65 is my plaintext (always an A)
      enc[21 + i] = enc[21 + i] ^ 65 ^ adminPayload[i];
    }
    enc = enc.toString('hex');
    return this.checkAdmin(enc);
  },
};

module.exports = bitflipper;
