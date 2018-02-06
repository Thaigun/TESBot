'use strict';

const https = require('https');

const puppeteer = require('puppeteer');

const helpers = require('./helpers');

const baseUrl = 'https://www.demi.fi/keskustelut/syvalliset';
//const baseUrl = 'https://www.demi.fi';
//const baseUrl = 'http://example.com';

const waitOptions = { waitUntil: ['load'/*, 'domcontentloaded', 'networkidle0'*/] };

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
            scraper.latestSnippet = postText;
        })();
    }

    getRandomSnippet() {
        //return helpers.rndChoose(this.snippets);
        return this.latestSnippet;
    }
}

module.exports = DemiScraper;