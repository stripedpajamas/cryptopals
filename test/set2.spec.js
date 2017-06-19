/**
 * Created by psquicciarini on 6/16/17.
 */

const chai = require('chai');
const fs = require('fs');
const path = require('path');

const one = require('../set2/1');

const expect = chai.expect;

describe('set2', () => {
  describe('challenge 1', () => {
    it('should pad according to PKCS#7', () => {
      const input = 'YELLOW SUBMARINE';
      const output = 'YELLOW SUBMARINE\x04\x04\x04\x04';

      expect(one(input, 'utf8', 20)).to.equal(output);
    });
  });
});
