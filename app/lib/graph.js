;

//options.data
//options.content_key
module.exports = function(options) {
    var graph = {};
    var links = [];
    var content_key = options.content_key || 'content';

    var support_threshold = 0.01;

    graph.w = [];
    graph.f = [];
    graph.data = [];

    function findDistance(id1, id2) {
        var f1 = graph.f[id1],
                f2 = graph.f[id2],
                dist = 0;
        for (var index in f1) {
            //Check if index also exists in f2
            if (f2[index]) {
                //console.log(index + " IS COMMON BETWEEN THE TWO");
                dist += f1[index] * f2[index];
            }
        }

        return dist / Math.pow(
                Math.max(graph.w[id1].length, graph.w[id2].length)
                , 2);
    }

    function createLink(id) {
        var max_dist = 0, dist;
        links[id] = id;
        var item = options.data[id], _item;

        for (var index = 0; index < id; index++) {
            _item = options.data[index];
            if (_item.hide) {
                continue;
            }
            
            if (JSON.stringify(item.content) == JSON.stringify(_item.content)) {
                item.hide = 1;
                break;
            }
            
            dist = findDistance(index, id);



            if (dist > support_threshold && dist >= max_dist) {
//                console.log(dist);
//                console.log(options.data[id]);
//                console.log(options.data[index]);

//                console.log(graph.f[id]);
//                console.log(graph.f[index]);
//                
//                console.log(sanitize(options.data[id].content));
//                console.log('\n');
//                console.log(sanitize(options.data[index].content));
//                console.log('\n\n\n');

                //Critical line
                links[id] = links[index];
//                links[id] = index;

                max_dist = dist;
            }
        }
    }

    function generateGraph() {
        var link;
        for (var index in links) {
            if(options.data[index].hide){
                continue;
            }
            
            link = links[index];
            if (!graph.data[link]) {
                graph.data[link] = [];
            }
            graph.data[link].push(options.data[index]);
        }
    }

    (function() {
        for (var index in options.data) {
            options.data[index].title = removeTags(options.data[index].title);
            options.data[index].content = removeTags(options.data[index].content);

            graph.w[index] = getWords(options.data[index][content_key]);
            graph.f[index] = getFrequencies(graph.w[index]);
            createLink(index);
        }
        generateGraph();
    })();

    return graph;
};