'use strict';

let helpers = require('./helpers');

/**
 * Parses pdf files from the given folder and saves the tweetable sentences
 * to a array where they can be queried from.
 */
class ContentParser {
    constructor(pdfFolder) {
        this.sentences = [];
    }

    parse() {
        // Parse the files here.

        this.sentences.push('Hello world1');
        this.sentences.push('Hello world2');
    }

    randomContent() {
        return helpers.rndChoose(this.sentences);
    }
}

module.export = ContentParser;