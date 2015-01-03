;
var graph;
require('./app/helpers');
require('./app/constants');
require('./app/sources');

var gfeed = require('./app/lib/feedfetcher');
var data = [
];

graph = require('./app/lib/graph')({
    data: data
});

gfeed.fetchFeeds(sources, function(data) {
    console.log('Fetching Done entering computation phase');
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

    app.get('/checker', function(req, res) {
        res.render('checker', {
            title: 'checker'
        });
    });

    app.post('/check', function(req, res) {
        gfeed.getArticles(req.body.data, function(data) {
            graph = require('./app/lib/graph')({
                data: data
            });
            res.send(graph.debug);
        });
    });

    http.createServer(app).listen(process.env.PORT || 3000, function() {
        console.log('Server Started');
    });
});
 