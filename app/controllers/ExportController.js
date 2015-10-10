const TEMPLATE = 'export';

var elasticsearch = require('elasticsearch'),
    md5 = require('md5'),
    fs = require('fs'),
    skip = 0,
    config = require('../config');

function getFinalQuery(query) {
    var page = {
        'from': skip,
        'size': config.elastic.pageSize
    };
}

function getFileName(query, format) {
    var dateTime = Date.now();
    return 'report-' + md5(JSON.stringify(query)) + '-' + dateTime + '.' + format;
}

function dispatchRequest(req, res) {
    var rawQuery = req.body['raw-query'],
        format = req.body.format,
        query = JSON.parse(rawQuery),
        model;

    model = {
        filename: getFileName(rawQuery, format),
        query: rawQuery
    };
    res.render(TEMPLATE, model);
    /*

     var client = new elasticsearch.Client({
     host: config.elastic.host + ':' + config.elastic.port,
     log: config.elastic.log
     });


     client.search({
     index: 'stm_v6',
     body: query
     }).then(function (resp) {

     }, function (err) {
     res.render(TEMPLATE, {error: err.message});
     });*/
}

module.exports = {
    dispatch: dispatchRequest
};