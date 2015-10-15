const TEMPLATE = 'export';

var elasticsearch = require('elasticsearch'),
    exp = require('../services/Export'),
    md5 = require('md5'),
    config = require('../config');

function getFileName(query, format) {
    var dateTime = Date.now();
    return 'report-' + md5(JSON.stringify(query)) + '-' + dateTime + '.' + format;
}

function exportData(query) {
    // scroll thru documents, save to format
    var exportData = [],
        client = new elasticsearch.Client({
            host: config.elastic.host + ':' + config.elastic.port,
            log: config.elastic.log
        });

    client.search({
        index: 'stm_v6',
        scroll: config.elastic.scrollTime,
        search_type: 'scan',
        body: query
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            exportData.push(hit._source.title);
        });
        if (response.hits.total !== exportData.length) {
            // now we can call scroll over and over
            client.scroll({
                scrollId: response._scroll_id,
                scroll: config.elastic.scrollTime
            }, getMoreUntilDone);
        } else {
            console.log('every "test" title', exportData);
        }
    });
}

function dispatchRequest(req, res) {
    var rawQuery = req.body['raw-query'],
        format = req.body.format,
        exportService = exp[format] ? exp[format]() : null,
        query = JSON.parse(rawQuery),
        model;

    model = {
        filename: getFileName(rawQuery, format),
        query: rawQuery
    };

    if (!exportService) {
        model.error = {message: 'Support for the export format ' + format + ' was not found.'};
    }

    res.render(TEMPLATE, model);
    exportData(query, exportService);
}

module.exports = {
    dispatch: dispatchRequest
};