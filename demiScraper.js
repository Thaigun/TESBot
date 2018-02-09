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
        this.maxSnippets = 50;
        this.snippets = [];
    }

    async scrapeSnippets() {
        let scraper = this;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(120 * 1000);
        try {
            await page.goto(baseUrl, waitOptions);
            await Promise.all([
                page.waitForNavigation(),
                page.click('.views-field-title > a')
            ]);
            
            let postText = await page.evaluate(() => {
                let allPosts = document.querySelectorAll('.field-item');
                return allPosts[allPosts.length - 1].innerText;
            });

            let extracted = this.extractSentence(postText);
            
            if (extracted != '') {
                scraper.insertSnippet(extracted);
                console.log('Fetched a new snippet: ' + extracted);
            }
        } catch(e) {
            console.log('Error while scraping.');
        } finally {
            await browser.close();
        }
    }

    /**
     * Extracts the last sentence from the forum post.
     */
    extractSentence(post) {
        post = post.replace(/\r?\n|\r/g, " ");
        post = post.replace('  ', ' ');
        let lastSentence = '';
        let currentSentence = '';
        let sentenceFinished = false;
        for (let char of post) {
            let alphaNumeric = validator.isAlphanumeric(char, 'sv-SE');
            if (currentSentence == '' && char.toUpperCase() === char && alphaNumeric) {
                currentSentence += char;
            } else if (currentSentence != '' && (char == '.' || char == '?' || char == '!')) {
                if (char != '.') {
                    // Titles don't have dots in their quotes
                    currentSentence += char;
                }
                lastSentence = currentSentence;
                sentenceFinished = true;
                currentSentence = '';
            } else if (currentSentence != '') {
                if (alphaNumeric || char == ' ') {
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

    /**
     * Inserts a snippet, controlling the size of the array.
     */
    insertSnippet(snippet) {
        if (this.snippets.includes('snippet')) {
            return;
        }

        if (this.snippets.length >= this.maxSnippets) {
            getRandomSnippet()
        }
        this.snippets.push(snippet);
    }

    getRandomSnippet() {
        if (this.snippets.length === 0) {
            return '';
        }

        let idx = helpers.randomInt(0, this.snippets.length - 1);
        let snippet = this.snippets[idx];
        this.snippets.splice(idx, 1);
        return snippet;
    }
}

module.exports = DemiScraper;