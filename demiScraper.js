'use strict';

const https = require('https');

const request = require('request');
const cheerio = require('cheerio');

const helpers = require('./helpers');

const baseUrl = 'https://www.demi.fi/keskustelut/syvalliset'

class DemiScraper {
    constructor() {
        this.snippets = [];
    }

    scrapeSnippets() {
        https.get(baseUrl, (res) => {
            let allHtml = '';
            
            res.on('data', (d) => {
                allHtml += d;
            });

            res.on('end', () => {
                this.handleHtml(allHtml);
            });

            res.on('error', (e) => {
                console.error(e.message);
            });
        });
    }

    handleHtml(html) {
        var $ = cheerio.load(html);
        $('a').each((i, elem) => {
            let link = $(this).attr('href');
            let debug = 2;
        });
    }

    getRandomSnippet() {
        return helpers.rndChoose(this.snippets);
    }
}

module.exports = DemiScraper;