'use strict';

const helpers = require('./helpers');

const baseUrl = 'https://www.demi.fi/keskustelut/syvalliset'

class DemiScraper {
    constructor() {
        this.snippets = [];
    }

    scrapeSnippets() {

    }

    getRandomSnippet() {
        return helpers.rndChoose(this.snippets);
    }
}

module.exports = DemiScraper;