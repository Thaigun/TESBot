'use strict'

const https = require('https');

const request = require('request');
const FeedParser = require('feedparser');

const helpers = require('./helpers');

class RSSStalker {
    /**
     * Make a list of channels, each having its own url and list of latest fetched titles.
     */
    constructor(sources) {
        this.channels = [];
        for (let url of sources) {
            this.channels.push({
                url: url,
                titles: []
            });
        }
    }

    updateTitlesForChannel(channel) {
        channel.titles = [];

        let feedParser = new FeedParser({addmeta: false});
        let req = request(channel.url);
        
        req.on('error', function(err) {
            // Handle error.
        });

        req.on('response', function(res) {
            let stream = this; // this is req
            if (res.statusCode === 200) {
                stream.pipe(feedParser);
            }
        });

        feedParser.on('error', function(err) {
            // Handle error here.
        });

        feedParser.on('readable', function() {
            let stream = this; // this is feedparser
            let meta = this.meta;
            let item = stream.read();

            if (item != null) {
                // If there is a quote in the title, add it.
                let quoteIdx = item.title.indexOf('\"');
                if (quoteIdx != -1 && quoteIdx < item.title.length && item.title[quoteIdx + 1].toUpperCase() === item.title[quoteIdx + 1]) {
                    channel.titles.push(item.title);
                }
            }
        });
    }

    updateTitles() {
        for (let channel of this.channels) {
            this.updateTitlesForChannel(channel);
        }
        console.log('Updating titles');
    }

    getRandomTitle() {
        let shuffled = helpers.shuffled(this.channels);
        for (let channel of shuffled) {
            let title = helpers.rndChoose(channel.titles);
            if (title != null) {
                return title;
            }
        }
        return null;
    }
}

module.exports = RSSStalker;