const TEMPLATE = 'report';

var elasticsearch = require('elasticsearch'),
    config = require('../config');

function dispatchRequest(req, res) {
    var rawQuery = req.body.rawQuery,
        query = JSON.parse(rawQuery),
        indexName = req.body.indexName,
        client = new elasticsearch.Client({
            host: config.elastic.host + ':' + config.elastic.port,
            log: config.elastic.log
        });

    client.search({
        index: indexName,
        body: query
    }).then(function (resp) {
        var model = {
            query: rawQuery,
            indexName: indexName,
            items: resp.hits.hits,
            total: resp.hits.total
        };
        res.render(TEMPLATE, model);
    }, function (err) {
        res.render(TEMPLATE, {error: err.message});
    });
}

module.exports = {
    dispatch: dispatchRequest
};