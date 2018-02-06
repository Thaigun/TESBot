'use strict';

const RSSStalker = require('./rssStalker');
const tweeter = require('./tweeter');
const Scraper = require('./demiScraper');

let stalker = new RSSStalker([
    'https://www.mtv.fi/api/feed/rss/uutiset_uusimmat', 
    'http://www.iltalehti.fi/rss.xml',
    'https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_UUTISET']);

let scraper = new Scraper();

let tweetedTitles = [];
let tweetedSnippets = [];

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
    let rndTitle = stalker.getRandomTitle();
    let rndSnippet = scraper.getRandomSnippet();
    let tweetContent = tweeter.generateTweet(rndTitle, rndSnippet);
    
    if (tweetContent.length > 280) {
        console.warn('Tweet aborted, length was too much: ' + tweetContent.length);
        return;
    }

    if (tweetedSnippets.indexOf(rndSnippet) !== -1) {
        console.warn('Snippet has been used, do not reuse: ' + rndSnippet);
        return;
    }

    if (tweetedTitles.indexOf(rndTitle) !== -1) {
        console.warn('Title has been used, do not reuse: ' + rndTitle);
        return;
    }
    
    if (tweetContent != null && tweetContent != '') {
        tweeter.tweet(tweetContent, function(err, tweet, response) {
            if (err) {
                console.warn(err);
            } else {
                tweetedTitles.push(rndTitle);
                tweetedSnippets.push(rndSnippet);
                if (tweetedTitles.length > 10000) { tweetedTitles = []; } // Clear it at some point
                if (tweetedSnippets.length > 10000) { tweetedSnippets = []; }
                console.log('Tweeted: ' + tweetContent);
            }
        });
    }
}

setImmediate(updateEverything);

setInterval(updateEverything, 1000*60*60); // Every hour, update data.

setTimeout(function() {
    setInterval(tweet, 1000*60*60*5); // Tweet every 5 hours.
}, 1000*60*10); // Starting after small offset. 

let testTweet = tweeter.generateTweet('Näin sanoo uutisankka: "Olisipa kaljaa"', 'Kyllä meillä ennen osattiin');
console.log(testTweet);