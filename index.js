'use strict';

const Twitter = require('twitter');

const ContentParser = require('./contentParser');

let client = new Twitter({
    consumer_key:           process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:        process.env.TWITTER_CONSUMER_SECRET,
    access_token_key:       process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret:    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:             60*1000,  // optional HTTP request timeout to apply to all requests.
});

let envs = process.env;
let parser = new ContentParser('pdfs');
parser.parse();

function sendRandomTweet() {
    let content = parser.randomContent();

    client.post('statuses/update', {
        status: content
    }, function(err, data, response) {
        console.log(data);
    });
}

//setImmediate(sendRandomTweet);
setInterval(sendRandomTweet, 1000*60*60*10 + 61234); // Couple of times a day, small offset to get variance on the time.

