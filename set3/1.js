/**
 * Created by psquicciarini on 7/6/17.
 */

const cbc = require('../set2/2');
const keyGen = require('../set2/3');
const padCheck = require('../set2/7');

const paddingOracle = {
  key: keyGen.generateRandomKey(16),
  iv: keyGen.generateRandomKey(16),
  plaintexts: [
    'MDAwMDAwTm93IHRoYXQgdGhlIHBhcnR5IGlzIGp1bXBpbmc=',
    'MDAwMDAxV2l0aCB0aGUgYmFzcyBraWNrZWQgaW4gYW5kIHRoZSBWZWdhJ3MgYXJlIHB1bXBpbic=',
    'MDAwMDAyUXVpY2sgdG8gdGhlIHBvaW50LCB0byB0aGUgcG9pbnQsIG5vIGZha2luZw==',
    'MDAwMDAzQ29va2luZyBNQydzIGxpa2UgYSBwb3VuZCBvZiBiYWNvbg==',
    'MDAwMDA0QnVybmluZyAnZW0sIGlmIHlvdSBhaW4ndCBxdWljayBhbmQgbmltYmxl',
    'MDAwMDA1SSBnbyBjcmF6eSB3aGVuIEkgaGVhciBhIGN5bWJhbA==',
    'MDAwMDA2QW5kIGEgaGlnaCBoYXQgd2l0aCBhIHNvdXBlZCB1cCB0ZW1wbw==',
    'MDAwMDA3SSdtIG9uIGEgcm9sbCwgaXQncyB0aW1lIHRvIGdvIHNvbG8=',
    'MDAwMDA4b2xsaW4nIGluIG15IGZpdmUgcG9pbnQgb2g=',
    'MDAwMDA5aXRoIG15IHJhZy10b3AgZG93biBzbyBteSBoYWlyIGNhbiBibG93',
  ],
  encrypt() {
    // randomly choose from a set of plaintexts
    const pt = this.plaintexts[Math.floor(Math.random() * this.plaintexts.length)];
    const ct = cbc.encrypt(pt, this.key, this.iv, 'base64');
    return {
      iv: this.iv,
      ciphertext: ct,
    };
  },
  checkPad(input) {
    const dec = cbc.decrypt(input, this.key, this.iv, 'hex');
    try {
      padCheck.removePad(dec, 'utf8', 16);
    } catch (e) {
      return false;
    }
    return true;
  },
};

module.exports = paddingOracle;
