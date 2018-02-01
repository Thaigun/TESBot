const Twitter = require('twitter');

let client = new Twitter({
    consumer_key:           process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:        process.env.TWITTER_CONSUMER_SECRET,
    access_token_key:       process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret:    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:             60*1000,  // optional HTTP request timeout to apply to all requests.
});

function sendTweet(content, callback) {
    client.post('statuses/update', {
        status: content
    }, callback);
}

/**
 * Title is the news title including the quote, snippet is a snippet from a forum.
 * This function returns a tweet, where the quote is replaced by the snippet.
 */
function generateTweet(title, snippet) {
    
}

module.exports = {
    sendTweet: sendTweet,
    generateTweet: generateTweet
};