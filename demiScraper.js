'use strict';

const https = require('https');

const puppeteer = require('puppeteer');
const validator = require('validator');

const helpers = require('./helpers');

const baseUrl = 'https://www.demi.fi';
const forumUrl = baseUrl + '/keskustelut/syvalliset';

const args = [];
const waitOptions = { waitUntil: ['load'/*, 'domcontentloaded'*/] };

class DemiScraper {
    constructor() {
        this.maxSnippets = 50;
        this.snippets = [];
    }

    async scrapeSnippets() {
        let scraper = this;
        const browser = await puppeteer.launch(args);
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.setDefaultNavigationTimeout(7 * 60 * 1000);

        // Don't load images, we don't need them and they slow it down.
        page.on('request', request => {
            if(request.resourceType() === 'image') {
                request.abort();
            } else {
                request.continue();
            }
        });

        try {
            await page.goto(forumUrl, waitOptions);
            console.log('Navigated to base url');
            
            // For some reason, couldn't make the click + waitForNavigation scheme work.
            // Get the link to the last post on the page.
            let threadLink = await page.evaluate(() => {
                let link = document.querySelector('.views-field-title > a').getAttribute('href');
                return link;
            });
            
            await page.goto(baseUrl + threadLink, waitOptions);
            
            console.log('Clicked a link');
            
            // Get the text inside the last message.
            let postText = await page.evaluate(() => {
                let allPosts = document.querySelectorAll('.field-item');
                return allPosts[allPosts.length - 1].innerText;
            });

            // Extract a sentence out from the whole post.
            let extracted = this.extractSentence(postText);
            
            if (extracted != '') {
                scraper.insertSnippet(extracted);
                console.log('Fetched a new snippet: ' + extracted);
            }
        } catch(e) {
            console.log('Error while scraping: ' + e.message);
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
                if (alphaNumeric || (char == ' ' && currentSentence.length > 1)) {
                    currentSentence += char;
                } else {
                    currentSentence = '';  // Let's not allow random characters or only one letter in the beginning of the sentence (probably a smiley).
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
        if (this.snippets.indexOf(snippet) !== -1) {
            return;
        }

        if (this.snippets.length >= this.maxSnippets) {
            // Drop the first (oldest) one.
            this.snippets.shift();
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
