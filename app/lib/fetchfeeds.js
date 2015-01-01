;
module.exports = function(sources, cb) {
    var gfeed = require('google-feed-api');
    gfeed.source_limit = sources.length;
    gfeed.articles_limit = articles_limit || 10;
    gfeed.count = 0;
    gfeed.data = Array();

    function fin() {
        gfeed.count++;
        if (gfeed.count == gfeed.source_limit) {
            cb(gfeed.data);
        }
    }

    function getFeedArticles(url) {
        var feed = new gfeed.Feed(url);
        feed.setNumEntries(gfeed.articles_limit);
        feed.includeHistoricalEntries();
        feed.load(function(res) {
            gfeed.data = gfeed.data.concat(res.feed.entries);
            fin();
        });
    }

    for (var index in sources) {
        getFeedArticles(sources[index]);
    }

    return gfeed;
};

/*
 
 
 module.exports = function(sources, cb) {
 var gfeed = require('google-feed-api');
 var limit = 0, count = 0;
 var data = Array();
 
 gfeed.parser = require('./readibility');
 gfeed.articles_limit = articles_limit || 10;
 
 
 function fin(res) {
 count++;
 data.push(res);
 
 if (count == limit) {
 cb(data);
 }
 }
 
 function getArticles(articles) {
 for (var index in articles) {
 gfeed.parser.parseUrl(articles[index].link, function(err, res) {
 fin(res);
 });
 }
 }
 
 function getFeed(url) {
 var feed = new gfeed.Feed(url);
 feed.setNumEntries(gfeed.articles_limit);
 feed.includeHistoricalEntries();
 feed.load(function(res) {
 var entries = res.feed.entries;
 limit += entries.length;
 getArticles(entries);
 });
 }
 
 for (var index in sources) {
 getFeed(sources[index]);
 }
 
 return gfeed;
 };*/