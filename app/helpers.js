;
var S = require('string');
var ignore_list = ['', ' ', 'a', 'an', 'the', 'of', 'by', 'are', 'to', 'and', 'as', 'is', 'was', 'in', 'some', 'at',
    'but', 'on', 'among', 'with', 'has', 'have', 'been', 'because', 'for', 'this', 'that', 'to', 'were', 'said', 'we',
    'here', 'there', 'be', 'it', 'not', 'near', 'far', 'its', 'they',
    'about', 'how', 'what', 'when', 'why', 'who'];

//HTML Strip Native Might have a similar feature
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
//        body_html = body_html.replace(/<a\b[^<]*(?:(?!<\/a>)<[^<]*)*<\/a>/gi, '');


            //Special symbols
            .replace(/[^a-zA-Z ]/g, " ")
            //Remove whitespaces
            .replace(/\s{2,}/g, " ");
};

removeTags = function(string) {
    string = string.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    return S(entities.decode(string)).stripTags().s;
};

getWords = function(string) {
    return sanitize(string).split(' ');
};

getFrequencies = function(words) {
    var result = {total_count: 0, words: {}};
    var word;
    for (var index in words) {
        word = words[index];

        if (word.length == 1)
            continue;

        if (result.words[word]) {
            result.words[word]++;
            result.total_count++;
            continue;
        }
        if (ignore_list.indexOf(word) == -1) {
            result.words[word] = 1;
        }
    }
    return result;
};


//File Operations
var fs = require('fs');

writeFile = function(file, string) {
    fs.writeFile(file, string, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}