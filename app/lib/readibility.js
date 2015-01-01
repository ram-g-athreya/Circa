;
var readability = require('readability-api');
var parser = new readability.parser();
readability.configure({
    consumer_key: 'ramgnsn5',
    consumer_secret: '4URcnbYZQcuBTQHKtwDqpDd9NdVzSD78',
    parser_token: '3cbc2eb5dfa4bb000e769fa75c4d758c82b75b77'
});

parser.parseUrl = function(url, cb) {
    parser.parse(url, function(err, parsed) {
        if (err)
            throw err;
        parsed.content = removeTags(parsed.content);
        cb(err, parsed);
    });
};

module.exports = parser;