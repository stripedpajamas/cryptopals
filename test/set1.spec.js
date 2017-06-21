/**
 * Created by psquicciarini on 6/13/17.
 */

const chai = require('chai');
const fs = require('fs');
const path = require('path');

const one = require('../set1/1');
const two = require('../set1/2');
const three = require('../set1/3');
const four = require('../set1/4');
const five = require('../set1/5');
const six = require('../set1/6');
const seven = require('../set1/7');
const eight = require('../set1/8');

const expect = chai.expect;

xdescribe('set1', () => {

  describe('challenge 1', () => {
    it('should convert hex to base64', () => {
      const input = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d';
      const output = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t';
      expect(one.hexToB64(input)).to.equal(output);
    });
  });

  describe('challenge 2', () => {
    it('should xor two strings of equal length', () => {
      const input1 = '1c0111001f010100061a024b53535009181c';
      const input2 = '686974207468652062756c6c277320657965';
      const output = '746865206b696420646f6e277420706c6179';
      expect(two(input1, input2)).to.equal(output);
    });
  });

  describe('challenge 3', () => {
    it('should find the most likely plaintext for a single-byte XOR cipher', () => {
      const input = '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736';
      const output = {
        key: 88,
        plaintext: "Cooking MC's like a pound of bacon"
      };
      expect(three.findLikelyPlaintext(input, 'hex')).to.deep.equal(output);
    })
  });

  describe('challenge 4', () => {
    it('should find the ciphertext encrypted with single-byte XOR', (done) => {
      const input = fs.readFileSync(path.resolve(__dirname, '../set1/text/4.txt'), 'utf8').split('\n');
      const output = {
        ciphertext: '7b5a4215415d544115415d5015455447414c155c46155f4058455c5b523f',
        plaintext: 'Now that the party is jumping\n'
      };
      four(input, (err, data) => {
        expect(data).to.deep.equal(output);
        done();
      });
      // expect(four(input)).to.deep.equal(output);
    }).timeout(10000);
  });

  describe('challenge 5', () => {
    it('should encrypt with repeating-key XOR with key ICE', () => {
      const input = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal";
      const output = '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f';
      expect(five(input, 'ICE', 'utf8')).to.equal(output);
    });
  });

  describe('challenge 6', () => {
    it('should calculate the hamming distance', () => {
      const input1 = 'this is a test';
      const input2 = 'wokka wokka!!!';

      expect(six.hammingDistance(input1, input2, 'utf8')).to.equal(37);
    });
    it('should crack a repeating-key XOR cipher', () => {
      const input = fs.readFileSync(path.resolve(__dirname, '../set1/text/6.txt'), 'utf8');
      const output = {
        key: 'Terminator X: Bring the noise',
        plaintext: "I'm back and I'm ringin' the bell \nA rockin' on the mike while the fly girls yell \nIn ecstasy in the back of me \nWell that's my DJ Deshay cuttin' all them Z's \nHittin' hard and the girlies goin' crazy \nVanilla's on the mike, man I'm not lazy. \n\nI'm lettin' my drug kick in \nIt controls my mouth and I begin \nTo just let it flow, let my concepts go \nMy posse's to the side yellin', Go Vanilla Go! \n\nSmooth 'cause that's the way I will be \nAnd if you don't give a damn, then \nWhy you starin' at me \nSo get off 'cause I control the stage \nThere's no dissin' allowed \nI'm in my own phase \nThe girlies sa y they love me and that is ok \nAnd I can dance better than any kid n' play \n\nStage 2 -- Yea the one ya' wanna listen to \nIt's off my head so let the beat play through \nSo I can funk it up and make it sound good \n1-2-3 Yo -- Knock on some wood \nFor good luck, I like my rhymes atrocious \nSupercalafragilisticexpialidocious \nI'm an effect and that you can bet \nI can take a fly girl and make her wet. \n\nI'm like Samson -- Samson to Delilah \nThere's no denyin', You can try to hang \nBut you'll keep tryin' to get my style \nOver and over, practice makes perfect \nBut not if you're a loafer. \n\nYou'll get nowhere, no place, no time, no girls \nSoon -- Oh my God, homebody, you probably eat \nSpaghetti with a spoon! Come on and say it! \n\nVIP. Vanilla Ice yep, yep, I'm comin' hard like a rhino \nIntoxicating so you stagger like a wino \nSo punks stop trying and girl stop cryin' \nVanilla Ice is sellin' and you people are buyin' \n'Cause why the freaks are jockin' like Crazy Glue \nMovin' and groovin' trying to sing along \nAll through the ghetto groovin' this here song \nNow you're amazed by the VIP posse. \n\nSteppin' so hard like a German Nazi \nStartled by the bases hittin' ground \nThere's no trippin' on mine, I'm just gettin' down \nSparkamatic, I'm hangin' tight like a fanatic \nYou trapped me once and I thought that \nYou might have it \nSo step down and lend me your ear \n'89 in my time! You, '90 is my year. \n\nYou're weakenin' fast, YO! and I can tell it \nYour body's gettin' hot, so, so I can smell it \nSo don't be mad and don't be sad \n'Cause the lyrics belong to ICE, You can call me Dad \nYou're pitchin' a fit, so step back and endure \nLet the witch doctor, Ice, do the dance to cure \nSo come up close and don't be square \nYou wanna battle me -- Anytime, anywhere \n\nYou thought that I was weak, Boy, you're dead wrong \nSo come on, everybody and sing this song \n\nSay -- Play that funky music Say, go white boy, go white boy go \nplay that funky music Go white boy, go white boy, go \nLay down and boogie and play that funky music till you die. \n\nPlay that funky music Come on, Come on, let me hear \nPlay that funky music white boy you say it, say it \nPlay that funky music A little louder now \nPlay that funky music, white boy Come on, Come on, Come on \nPlay that funky music \n"
      };

      expect(six.crackRepeatingXOR(input)).to.deep.equal(output);
    }).timeout(5000);
  });

  describe('challenge 7', () => {
    it('should decode AES-ECB when given a key', () => {
      const input = fs.readFileSync(path.resolve(__dirname, '../set1/text/7.txt'), 'utf8');
      const output = 'I\'m back and I\'m ringin\' the bell \nA rockin\' on the mike while the fly girls yell \nIn ecstasy in the back of me \nWell that\'s my DJ Deshay cuttin\' all them Z\'s \nHittin\' hard and the girlies goin\' crazy \nVanilla\'s on the mike, man I\'m not lazy. \n\nI\'m lettin\' my drug kick in \nIt controls my mouth and I begin \nTo just let it flow, let my concepts go \nMy posse\'s to the side yellin\', Go Vanilla Go! \n\nSmooth \'cause that\'s the way I will be \nAnd if you don\'t give a damn, then \nWhy you starin\' at me \nSo get off \'cause I control the stage \nThere\'s no dissin\' allowed \nI\'m in my own phase \nThe girlies sa y they love me and that is ok \nAnd I can dance better than any kid n\' play \n\nStage 2 -- Yea the one ya\' wanna listen to \nIt\'s off my head so let the beat play through \nSo I can funk it up and make it sound good \n1-2-3 Yo -- Knock on some wood \nFor good luck, I like my rhymes atrocious \nSupercalafragilisticexpialidocious \nI\'m an effect and that you can bet \nI can take a fly girl and make her wet. \n\nI\'m like Samson -- Samson to Delilah \nThere\'s no denyin\', You can try to hang \nBut you\'ll keep tryin\' to get my style \nOver and over, practice makes perfect \nBut not if you\'re a loafer. \n\nYou\'ll get nowhere, no place, no time, no girls \nSoon -- Oh my God, homebody, you probably eat \nSpaghetti with a spoon! Come on and say it! \n\nVIP. Vanilla Ice yep, yep, I\'m comin\' hard like a rhino \nIntoxicating so you stagger like a wino \nSo punks stop trying and girl stop cryin\' \nVanilla Ice is sellin\' and you people are buyin\' \n\'Cause why the freaks are jockin\' like Crazy Glue \nMovin\' and groovin\' trying to sing along \nAll through the ghetto groovin\' this here song \nNow you\'re amazed by the VIP posse. \n\nSteppin\' so hard like a German Nazi \nStartled by the bases hittin\' ground \nThere\'s no trippin\' on mine, I\'m just gettin\' down \nSparkamatic, I\'m hangin\' tight like a fanatic \nYou trapped me once and I thought that \nYou might have it \nSo step down and lend me your ear \n\'89 in my time! You, \'90 is my year. \n\nYou\'re weakenin\' fast, YO! and I can tell it \nYour body\'s gettin\' hot, so, so I can smell it \nSo don\'t be mad and don\'t be sad \n\'Cause the lyrics belong to ICE, You can call me Dad \nYou\'re pitchin\' a fit, so step back and endure \nLet the witch doctor, Ice, do the dance to cure \nSo come up close and don\'t be square \nYou wanna battle me -- Anytime, anywhere \n\nYou thought that I was weak, Boy, you\'re dead wrong \nSo come on, everybody and sing this song \n\nSay -- Play that funky music Say, go white boy, go white boy go \nplay that funky music Go white boy, go white boy, go \nLay down and boogie and play that funky music till you die. \n\nPlay that funky music Come on, Come on, let me hear \nPlay that funky music white boy you say it, say it \nPlay that funky music A little louder now \nPlay that funky music, white boy Come on, Come on, Come on \nPlay that funky music \n\u0004\u0004\u0004\u0004';
      const key = 'YELLOW SUBMARINE';
      expect(seven.decrypt(input, key, 'base64', 'utf8')).to.equal(output);
    });
    it('should encode AES-ECB', () => {
      const input = 'two seventy three alfredo sauce!';
      const output = '7fd5e4aa58a5ba5ccd0f36f70ec73f9118b85f95de41ce8ffc179f6f3500a61f';
      const key = 'KOMBUCHA IS LIFE';
      expect(seven.encrypt(input, key, 'utf8', 'utf8')).to.equal(output);
      expect(seven.decrypt(output, key, 'hex', 'utf8')).to.equal(input);
    });
  });

  describe('challenge 8', () => {
    it('should detect when ECB was used', () => {
      const input = fs.readFileSync(path.resolve(__dirname, '../set1/text/8.txt'), 'utf8').split('\n');
      const output = [ 132 ]; // should return the index/s of the ECB encrypted ciphertext
      expect(eight(input)).to.deep.equal(output);
    });
  });
});
