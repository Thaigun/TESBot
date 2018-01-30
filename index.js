'use strict';

import { setInterval } from 'timers';

var Twit = require('twit');

var ContentParser = require('./contentParser');

var T = new Twit({
    consumer_key:           '...',
    consumer_secret:        '...',
    access_token:           '...',
    access_token_secret:    '...',
    timeout_ms:             60*1000,  // optional HTTP request timeout to apply to all requests.
});

let parser = new ContentParser();
parser.parse();

setInterval(function() {
    let content = parser.randomContent();

    T.post('statuses/update', {
        status: content
    }, function(err, data, response) {
        console.log(data);
    });
}, 1000*60*60*10 + 61234); // Couple of times a day, small offset to get variance on the time.

