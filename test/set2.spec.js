/**
 * Created by psquicciarini on 6/16/17.
 */

const chai = require('chai');
const fs = require('fs');
const path = require('path');

const one = require('../set2/1');
const two = require('../set2/2');
const three = require('../set2/3');

const expect = chai.expect;

describe('set2', () => {
  describe('challenge 1', () => {
    it('should pad according to PKCS#7', () => {
      const input = 'YELLOW SUBMARINE';
      const output = 'YELLOW SUBMARINE\x04\x04\x04\x04';

      expect(one(input, 'utf8', 20)).to.equal(output);
    });
  });

  describe('challenge 2', () => {
    it('should encrypt and decrypt using AES-CBC', () => {
      const input = 'two seventy three alfredo sauce!';
      const output = '7fd5e4aa58a5ba5ccd0f36f70ec73f91ca1478ceb2ee32b5a956ca460ee6f6ee';
      const key = 'KOMBUCHA IS LIFE';

      expect(two.encrypt(input, key, 0, 'utf8', 'utf8')).to.equal(output);
      expect(two.decrypt(output, key, 0, 'hex', 'utf8')).to.equal(input);
    });
    it('should decrypt a CBC-mode AES encrypted text which given the key', () => {
      const input = fs.readFileSync(path.resolve(__dirname, '../set2/text/10.txt'), 'utf8');
      const output = 'I\'m back and I\'m ringin\' the bell \nA rockin\' on the mike while the fly girls yell \nIn ecstasy in the back of me \nWell that\'s my DJ Deshay cuttin\' all them Z\'s \nHittin\' hard and the girlies goin\' crazy \nVanilla\'s on the mike, man I\'m not lazy. \n\nI\'m lettin\' my drug kick in \nIt controls my mouth and I begin \nTo just let it flow, let my concepts go \nMy posse\'s to the side yellin\', Go Vanilla Go! \n\nSmooth \'cause that\'s the way I will be \nAnd if you don\'t give a damn, then \nWhy you starin\' at me \nSo get off \'cause I control the stage \nThere\'s no dissin\' allowed \nI\'m in my own phase \nThe girlies sa y they love me and that is ok \nAnd I can dance better than any kid n\' play \n\nStage 2 -- Yea the one ya\' wanna listen to \nIt\'s off my head so let the beat play through \nSo I can funk it up and make it sound good \n1-2-3 Yo -- Knock on some wood \nFor good luck, I like my rhymes atrocious \nSupercalafragilisticexpialidocious \nI\'m an effect and that you can bet \nI can take a fly girl and make her wet. \n\nI\'m like Samson -- Samson to Delilah \nThere\'s no denyin\', You can try to hang \nBut you\'ll keep tryin\' to get my style \nOver and over, practice makes perfect \nBut not if you\'re a loafer. \n\nYou\'ll get nowhere, no place, no time, no girls \nSoon -- Oh my God, homebody, you probably eat \nSpaghetti with a spoon! Come on and say it! \n\nVIP. Vanilla Ice yep, yep, I\'m comin\' hard like a rhino \nIntoxicating so you stagger like a wino \nSo punks stop trying and girl stop cryin\' \nVanilla Ice is sellin\' and you people are buyin\' \n\'Cause why the freaks are jockin\' like Crazy Glue \nMovin\' and groovin\' trying to sing along \nAll through the ghetto groovin\' this here song \nNow you\'re amazed by the VIP posse. \n\nSteppin\' so hard like a German Nazi \nStartled by the bases hittin\' ground \nThere\'s no trippin\' on mine, I\'m just gettin\' down \nSparkamatic, I\'m hangin\' tight like a fanatic \nYou trapped me once and I thought that \nYou might have it \nSo step down and lend me your ear \n\'89 in my time! You, \'90 is my year. \n\nYou\'re weakenin\' fast, YO! and I can tell it \nYour body\'s gettin\' hot, so, so I can smell it \nSo don\'t be mad and don\'t be sad \n\'Cause the lyrics belong to ICE, You can call me Dad \nYou\'re pitchin\' a fit, so step back and endure \nLet the witch doctor, Ice, do the dance to cure \nSo come up close and don\'t be square \nYou wanna battle me -- Anytime, anywhere \n\nYou thought that I was weak, Boy, you\'re dead wrong \nSo come on, everybody and sing this song \n\nSay -- Play that funky music Say, go white boy, go white boy go \nplay that funky music Go white boy, go white boy, go \nLay down and boogie and play that funky music till you die. \n\nPlay that funky music Come on, Come on, let me hear \nPlay that funky music white boy you say it, say it \nPlay that funky music A little louder now \nPlay that funky music, white boy Come on, Come on, Come on \nPlay that funky music \n\u0004\u0004\u0004\u0004';
      const key = 'YELLOW SUBMARINE';

      expect(two.decrypt(input, key, 0, 'base64', 'utf8')).to.equal(output);
    });
  });

  describe('challenge 3', () => {
    it('should generate a random 16-byte key', () => {
      const key1 = three.generateRandomKey(16);
      const key2 = three.generateRandomKey(16);
      expect(key1.length).to.equal(16);
      expect(key1).to.not.equal(key2);
    });
    it('should append random-length bytes to plaintext', () => {
      const input = Buffer.from('hello world');
      const inputLength = input.length;
      expect(three.appendPlaintext(input).length).to.not.equal(inputLength);
    });
    it('should encrypt the same input randomly', () => {
      const input = 'See the line where the sky meets the sea? It calls me.';
      const output1 = three.randomEncrypt(input, 'utf8');
      const output2 = three.randomEncrypt(input, 'utf8');
      expect(output1).to.not.equal(output2);
    });
  });
});
