;
var S = require('string');
var ignore_list = ['', ' ', 'a', 'an', 'the', 'of', 'by', 'are', 'to', 'and', 'as', 'is', 'was', 'in', 'some', 'at',
    'but', 'on', 'among', 'with', 'has', 'have', 'been', 'because', 'for', 'this', 'that', 'to',
    'how', 'what', 'when', 'why', 'who'];

var Entities = require('html-entities').XmlEntities;
entities = new Entities();


//Remove unnecessary characters
sanitize = function(string) {
    return removeTags(string).toLowerCase()
            .replace(/\'/g, " ")
            .replace(/\./g, " ")
            .replace(/\,/g, " ")
            .replace(/\"/g, " ")
            .replace(/\//g, " ")
            .replace(/-/g, " ")
            .replace(/[^a-zA-Z ]/g, "");
};

removeTags = function(string) {
    return S(entities.decode(string)).stripTags().s;
};

getWords = function(string) {
    return sanitize(string).split(' ');
};

getFrequencies = function(words) {
    var result = {};
    var word;
    for (var index in words) {
        word = words[index];
        if (result[word]) {
            result[word]++;
            continue;
        }
        if (ignore_list.indexOf(word) == -1) {
            result[word] = 1;
        }
    }
    return result;
};