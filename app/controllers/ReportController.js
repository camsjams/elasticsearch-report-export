const TEMPLATE = 'report';

var elasticsearch = require('elasticsearch'),
    mapServ = require('../services/MappingService'),
    config = require('../config');

function dispatchRequest(req, res) {
    var rawQuery = req.body.rawQuery,
        query = JSON.parse(rawQuery),
        client = new elasticsearch.Client({
            host: config.elastic.host + ':' + config.elastic.port,
            log: config.elastic.log
        }),
        model = {
            rawQuery: rawQuery,
            indexName: req.body.indexName,
            typeName: req.body.typeName,
            query: query
        };

    mapServ.getMapping(model.indexName, model.typeName)
        .then(function (fieldMap) {
            client.search({
                index: model.indexName,
                body: query
            }).then(function (resp) {
                model.items = resp.hits.hits;
                model.total = resp.hits.total;
                model.fieldMap = fieldMap;
                res.render(TEMPLATE, model);
            }, function (err) {
                res.render(TEMPLATE, {error: err.message});
            });
        }).catch(function () {
            console.log('getMapping catch', arguments);
        });
}

module.exports = {
    dispatch: dispatchRequest
};