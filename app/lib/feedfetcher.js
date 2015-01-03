;

var gfeed = require('google-feed-api');
var request = require('request');
var cheerio = require('cheerio');

var limit;
var count;
var cb;

gfeed.data = Array();

function fin(data) {
    count++;

    if (data.content.length >= min_article_length) {
        gfeed.data.push(data);
        console.log(count + ' is count ' + limit + ' is limit');
        console.log(data.content.length + '\t' + data.title);
        console.log(data.link);
        console.log('\n\n');
    }

    if (count == limit) {
        writeFile('data', JSON.stringify(gfeed.data));
        cb(gfeed.data);
    }
}

gfeed.getFeedArticles = function(url) {
    var feed = new gfeed.Feed(url);
    feed.setNumEntries(articles_limit);
    feed.includeHistoricalEntries();
    feed.load(function(res) {
        var entries = res.feed.entries;
        limit += entries.length;
        for (var index in entries) {
            gfeed.getArticleContent(entries[index]);
        }
    });
};

gfeed.getArticleContent = function(options) {
    request(options.link, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var body_html = "", text;
            var $ = cheerio.load(body);
            body = $('body');

            $('body p').each(function() {
                text = removeTags($(this).html());
                if (text.length >= min_paragraph_length) {
                    body_html += text + " ";
                }
            });

            options.content = body_html;
            fin(options);
        }
        else {
            console.log('SOME ERROR HAPPENED FOR ' + options.link);
            limit--;
        }
    });
};

function reset() {
    limit = 0;
    count = 0;

    gfeed.data = Array();
}

gfeed.getArticles = function(articles, _cb) {
    reset();
    if (_cb)
        cb = _cb;
    limit = articles.length;
    for (var index in articles) {
        gfeed.getArticleContent({
            link: articles[index]
        });
    }
};

gfeed.fetchFeeds = function(sources, _cb) {
    reset();
    if (_cb)
        cb = _cb;

    for (var index in sources) {
        gfeed.getFeedArticles(sources[index]);
    }
};

module.exports = gfeed;
