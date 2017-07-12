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
    const ciphertext = cbc.encrypt(pt, this.key, this.iv, 'base64');
    return {
      iv: this.iv,
      ciphertext,
    };
  },
  checkPad({ iv, ciphertext }) {
    const dec = cbc.decrypt(ciphertext, this.key, iv, 'hex');
    try {
      padCheck.removePad(dec, 'utf8', 16);
    } catch (e) {
      return false;
    }
    return true;
  },
  crack({ iv, ciphertext }) {
    // should take a ciphertext object as returned from the encrypt function
    const ct = Buffer.concat([iv, Buffer.from(ciphertext, 'hex')]);
    const pt = Buffer.alloc(ct.length - 16);

    for (let b = ct.length - 16; b >= 16; b -= 16) {
      // grab block of the ct to crack
      const crackBlock = ct.slice(b, b + 16).toString('hex');
      const ptBlock = Buffer.alloc(16);
      for (let j = 1; j <= 16; j += 1) {
        const fakePreviousBlock = Buffer.alloc(16);
        ptBlock.copy(fakePreviousBlock); // copy what we already know into our fake block
        for (let k = 1; k < j; k += 1) {
          fakePreviousBlock[16 - k] = fakePreviousBlock[16 - k] ^ j ^ ct[b - k];
        }
        let validPadGuess;
        // i is the guess
        // we are trying to get correct padding
        // once we have correct padding, P'[k] (0x01) = P[k] xor C[k] xor C'[k] (which is i)
        // so P[k] = 0x01 xor C[k] xor i
        for (let i = 255; i >= 0; i -= 1) {
          fakePreviousBlock[16 - j] = i;
          if (this.checkPad({ iv: fakePreviousBlock, ciphertext: crackBlock })) {
            if (validPadGuess) { // if we already had a guess in there
              // try changing the second-to-last byte to make sure we only get the 0x01 padding
              fakePreviousBlock[14] = i;
              if (this.checkPad({ iv: fakePreviousBlock, ciphertext: crackBlock })) {
                validPadGuess = i;
              }
            } else {
              validPadGuess = i;
            }
          }
        }
        // now that we have the valid pad guess, we can determine the PT value for that byte
        ptBlock[16 - j] = j ^ ct[b - j] ^ validPadGuess;
      }
      ptBlock.copy(pt, b - 16);
    }
    // remove pad off final cracked plaintext
    return padCheck.removePad(pt.toString(), 'utf8', 16);
  },
};

module.exports = paddingOracle;
