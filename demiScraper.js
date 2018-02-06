'use strict';

const https = require('https');

const puppeteer = require('puppeteer');
const validator = require('validator');

const helpers = require('./helpers');

const baseUrl = 'https://www.demi.fi/keskustelut/syvalliset';
//const baseUrl = 'https://www.demi.fi';
//const baseUrl = 'http://example.com';

const waitOptions = { waitUntil: ['load'/*, 'domcontentloaded'*/] };

class DemiScraper {
    constructor() {
        this.latestSnippet = '';
    }

    scrapeSnippets() {
        this.latestSnippet = '';
        let scraper = this;
        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);
            await page.goto(baseUrl, waitOptions);
            await Promise.all([
                page.waitForNavigation(),
                page.click('.views-field-title > a')
            ]);
            
            let postText = await page.evaluate(() => {
                let allPosts = document.querySelectorAll('.field-item');
                return allPosts[allPosts.length - 1].innerText;
            });
            browser.close();
            
            let extracted = this.extractSentence(postText);
            if (extracted != '') {
                scraper.latestSnippet = extracted;
                console.log('Fetched a new snippet: ' + scraper.latestSnippet);
            }
        })();
    }

    /**
     * Extracts the last sentence from the forum post.
     */
    extractSentence(post) {
        let lastSentence = '';
        let currentSentence = '';
        let sentenceFinished = false;
        for (let char of post) {
            let alphaNumeric = validator.isAlphanumeric(char, 'sv-SE');
            if (currentSentence == '' && char.toUpperCase() === char && alphaNumeric) {
                currentSentence += char;
            } else if (currentSentence != '' && (char == '.' || char == '?' || char == '!')) {
                currentSentence += char;
                lastSentence = currentSentence;
                sentenceFinished = true;
                currentSentence = '';
            } else if (currentSentence != '') {
                if (alphaNumeric) {
                    currentSentence += char;
                } else {
                    currentSentence = '';  // Let's not allow random characters.
                }
            }
        }

        if (sentenceFinished) {
            return lastSentence;
        } else {
            console.log('Valid sentence was not found from the following post: ' + post);
            return '';
        }
    }

    getRandomSnippet() {
        return this.latestSnippet;
    }
}

module.exports = DemiScraper;