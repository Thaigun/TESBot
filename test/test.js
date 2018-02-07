'use strict'

var chai = require('chai');
var expect = chai.expect;

var tweeter = require('../tweeter');
var DemiScraper = require('../demiScraper');
var scraper = new DemiScraper();

var validSentence1 = 'Validi lause.'
var validSentence2 = 'Toinen lause.';
var lowercaseSentence = 'pelkkää pientä kirjainta.';
var withoutDot = 'Milloin tämä lause loppuu';
var withNumbers = 'Olipa kerran 7 kääpiötä.';
var specialCharacters = 'Mitä edes ¤ tarkoittaa.';

describe('demiScraper', function() {
    describe('extractSentence', function() {
        describe('valid posts', function() {
            it('should work with single valid sentence', function() {
                let scraped = scraper.extractSentence(validSentence1);
                expect(scraped + '.').to.equal(validSentence1);
            });
    
            it('should pick the last one of many valid sentences.', function() {
                let scraped = scraper.extractSentence(validSentence1 + ' ' + validSentence2);
                expect(scraped + '.').to.equal(validSentence2);
            });

            it('should find the valid sentence if it is first', function() {
                let scraped = scraper.extractSentence(validSentence1 + ' ' + withoutDot);
                expect(scraped + '.').to.equal(validSentence1);
            });

            it('should find the valid sentence if it is last', function() {
                let scraped = scraper.extractSentence(specialCharacters + ' ' + validSentence2);
                expect(scraped + '.').to.equal(validSentence2);
            });
            
            it('should accept sentences with numbers', function() {
                let scraped = scraper.extractSentence(withNumbers);
                expect(scraped + '.').to.equal(withNumbers);
            });
        });
        
        describe('invalid posts', function() {
            it('should not accept special characters in middle of the sentence', function() {
                let scraped = scraper.extractSentence(specialCharacters);
                expect(scraped).to.equal('');
            });

            it('should not accept without capital letter in the beginning', function() {
                let scraped = scraper.extractSentence(lowercaseSentence);
                expect(scraped).to.equal('');
            });

            it('should not accept without a dot in the end', function() {
                let scraped = scraper.extractSentence(withoutDot);
                expect(scraped).to.equal('');
            });
        });
    })
});

describe('tweeter', function() {
    describe('generateTweet', function() {
        it('should work in a simple case');
        it('should not work without quotation marks');
    });
});