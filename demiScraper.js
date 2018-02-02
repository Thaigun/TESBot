'use strict';

const request = require('request');
const cheerio = require('cheerio');

const helpers = require('./helpers');

const baseUrl = 'https://www.demi.fi/keskustelut/syvalliset'

class DemiScraper {
    constructor() {
        this.snippets = [];
    }

    scrapeSnippets() {
        request(baseUrl, function(error, response, html) {
            if (!error && response.statusCode == 200) {
                // This gives us jQuery-like syntax for parsing the html string.
                var $ = cheerio.load(html);
                $('a').each((i, elem) => {
                    let link = $(this).attr('href');
                    let debug = 2;
                });
            }
        });
    }

    getRandomSnippet() {
        return helpers.rndChoose(this.snippets);
    }
}

module.exports = DemiScraper;