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

let updateInProgress = false;

/**
 * This triggers the whole cycle from fetchiong the news titles and forum posts
 * to tweeting them.
 */
async function updateEverything() {
    updateInProgress = true;
    // Not idiot proof, but the bottle neck is basically always the scraping part so we are pretty safe here...
    stalker.updateTitles();
    await scraper.scrapeSnippets();
    updateInProgress = false;
}

/**
 * Send a tweet from random title + forum snippet.
 */
function tweet() {
    let rndTitle = stalker.getRandomTitle();
    let rndSnippet = scraper.getRandomSnippet();

    if (rndTitle == null || rndSnippet == null) {
        return;
    }

    let tweetContent = tweeter.generateTweet(rndTitle, rndSnippet);
    
    if (tweetContent == null) {
        console.log('Tweet not sent, tweet content was not available.');
        return;
    }

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
    
    if (tweetContent != '') {
        tweeter.sendTweet(tweetContent, function(err, tweet, response) {
            if (err) {
                console.warn(err);
            } else {
                tweetedTitles.push(rndTitle);
                tweetedSnippets.push(rndSnippet);
                if (tweetedTitles.length > 1000) { tweetedTitles = []; } // Clear it at some point
                if (tweetedSnippets.length > 1000) { tweetedSnippets = []; }
                console.log('Tweeted: ' + tweetContent);
            }
        });
    }
}

setImmediate(updateEverything);

setInterval(function () {
    if (!updateInProgress) {
        updateEverything();
    }
}, 1000*60*30); // Every half an hour, update data.

setTimeout(function() {
    setImmediate(tweet);
    setInterval(tweet, 1000*60*60*5); // Tweet every 5 hours.
}, 1000*60*10); // Starting after small offset. 
