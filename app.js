;
var graph;
require('./app/helpers');
require('./app/constants');

require('./app/lib/fetchfeeds')(
        [
            'http://www.thehindu.com/news/national/?service=rss',
            'http://timesofindia.feedsportal.com/c/33039/f/533965/index.rss',
            'http://feeds.hindustantimes.com/HT-HomePage-TopStories',
            'http://feeds.feedburner.com/NdtvNews-TopStories',
            'http://indianexpress.com/section/india/feed/',
            'http://www.firstpost.com/india/feed',
            'http://www.tehelka.com/?feed=custom_feed',
            'http://feeds.feedburner.com/NDTV-Business',
            'http://economictimes.indiatimes.com/rssfeedsdefault.cms',
            'http://www.oneindia.com/rss/news-india-fb.xml'
            
//            'http://topics.nytimes.com/top/opinion/editorialsandoped/editorials/index.html?rss=1',
//            'http://www.theguardian.com/tone/editorials/rss',
//            'http://online.wsj.com/xml/rss/3_7041.xml',
//            'http://washingtonpost.com/rss/opinions'
        ], function(data) {
    console.log('Computation Done');
    graph = require('./app/lib/graph')({
        data: data
    });

//    function getArticles(data) {
//        if (data.length > 1) {
//            for (var index in data) {
//                console.log(data[index].title, data[index].link);
//            }
//            console.log('\n');
//        }
//    }

//    for (var index in graph.data) {
//        getArticles(graph.data[index]);
//    }

});

var express = require('express');
var http = require('http');
var path = require('path');

app = express();
app.configure(function() {
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'html');
    app.engine('.html', require('ejs').__express);


    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

    app.locals.basedir = path.join(__dirname, '/app/views');


    app.basepath = __dirname;

    app.get('/', function(req, res) {
        //console.log(graph.data);

        res.render('index', {
            title: 'Circa',
            data: graph.data
        });
    });

    http.createServer(app).listen(process.env.PORT || 3000, function() {
        console.log('Server Started');
    });
});
