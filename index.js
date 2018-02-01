'use strict';

const RSSStalker = require('./rssStalker');
const tweeter = require('./tweeter');
const Scraper = require('./demiScraper');

let stalker = new RSSStalker([
    'https://www.mtv.fi/api/feed/rss/uutiset_uusimmat', 
    'http://www.iltalehti.fi/rss.xml',
    'https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_UUTISET']);

    let scraper = new Scraper();

/**
 * This triggers the whole cycle from fetchiong the news titles and forum posts
 * to tweeting them.
 */
function updateEverything() {
    stalker.updateTitles();
    scraper.scrapeSnippets();
}

/**
 * Send a tweet from random title + forum snippet.
 */
function tweet() {
    let tweetContent = tweeter.generateTweet(stalker.getRandomTitle(), scraper.getRandomSnippet());
    tweeter.tweet(tweetContent, function(err, tweet, response) {
        // Implement logging twitter responses or errors here.
    });
}

setImmediate(updateEverything);

setInterval(updateEverything, 1000*60*60); // Every hour, update data.

setTimeout(function() {
    setInterval(tweet, 1000*60*60*5); // Tweet every 5 hours.
}, 1000*60*10); // Starting after small offset.