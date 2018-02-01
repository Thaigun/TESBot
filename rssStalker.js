'use strict'

const https = require('https');

const request = require('request');
const FeedParser = require('feedparser');

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
                if (item.title.indexOf('\"') != -1) {
                    channel.titles.push(item.title);
                }
            }
        });
    }

    updateTitles() {
        for (let channel of this.channels) {
            this.updateTitlesForChannel(channel);
        }
    }

    getRandomTitle() {

    }
}

module.exports = RSSStalker;