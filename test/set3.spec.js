/**
 * Created by psquicciarini on 7/6/17.
 */

const chai = require('chai');
const fs = require('fs');
const path = require('path');

const one = require('../set3/1');
const two = require('../set3/2');

const expect = chai.expect;

describe('set 3', () => {
  describe('challenge 1', () => {
    const list = [
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
    ];

    it('should encrypt a randomly chosen plaintext', () => {
      const cbc = require('../set2/2'); // will decrypt ourselves
      const pad = require('../set2/7');
      const ct = one.encrypt();
      const key = one.key;
      const dec = cbc.decrypt(ct.ciphertext, key, ct.iv, 'hex');
      const pt = pad.removePad(dec, 'utf8', 16);

      expect(list).to.include(Buffer.from(pt).toString('base64'));
    });
    it('should throw up if the padding is wrong', () => {
      const ct = one.encrypt();
      const bufferedCt = Buffer.from(ct.ciphertext, 'hex');

      // edit the last byte of the 2nd to last block, thereby causing a change in the last byte
      bufferedCt[bufferedCt.length - 17] = ~bufferedCt[bufferedCt.length - 17];

      expect(one.checkPad({ iv: ct.iv, ciphertext: bufferedCt })).to.be.false;
    });
    it('should crack the ciphertext using the padding oracle attack', () => {
      const ct = one.encrypt();
      const cracked = one.crack(ct);
      expect(list).to.include(Buffer.from(cracked).toString('base64'));
    });
  });

  describe('challenge 2', () => {
    it('should increment buffers', () => {
      expect(two.increment(Buffer.from([0, 0, 0, 0]))).to.deep.equal(Buffer.from([0, 0, 0, 1]));
      expect(two.increment(Buffer.from([0, 0, 0, 0]), { le: true })).to.deep.equal(Buffer.from([1, 0, 0, 0]));
    });
    it('should encrypt and decrypt in CTR mode', () => {
      const input = 'L77na/nrFsKvynd6HzOoG7GHTLXsTVu9qvY/2syLXzhPweyyMTJULu/6/kXX0KSvoOLSFQ==';
      const nonce = 0;
      const key = 'YELLOW SUBMARINE';
      const output = 'Yo, VIP Let\'s kick it Ice, Ice, baby Ice, Ice, baby ';

      const processedInput = two.process(input, nonce, key, { inputEnc: 'base64', le: true });
      const processedOutput = two.process(output, nonce, key, { inputEnc: 'utf8', le: true });

      expect(processedInput.toString()).to.equal(output);
      expect(processedOutput.toString('base64')).to.equal(input);
    });
  });
});