const TEMPLATE = 'export';

var elasticsearch = require('elasticsearch'),
    exp = require('../services/Export'),
    md5 = require('md5'),
    config = require('../config');

function getFileName(query, format) {
    var dateTime = Date.now();
    return 'report-' + md5(JSON.stringify(query)) + '-' + dateTime + '.' + format;
}

function exportData(model, expSvc) {
    // scroll thru documents, save to format
    var client = new elasticsearch.Client({
        host: config.elastic.host + ':' + config.elastic.port,
        log: config.elastic.log
    });

    expSvc.createWriteStream(config.outputDirectory + model.filename);

    client.search({
        index: 'stm_v6',
        scroll: config.elastic.scrollTime,
        search_type: 'scan',
        body: model.query
    }, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
            expSvc.write(hit._source.title);
        });
        if (response.hits.total > expSvc.getTotal()) {
            console.log('exportData completed', expSvc.length);
            // now we can call scroll over and over
            client.scroll({
                scrollId: response._scroll_id,
                scroll: config.elastic.scrollTime
            }, getMoreUntilDone);
        } else {
            console.log('exportData completed', expSvc.getTotal());
            expSvc.end();
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
        rawQuery: rawQuery,
        query: query
    };

    if (!exportService) {
        model.error = {message: 'Support for the export format ' + format + ' was not found.'};
    } else {
        exportData(model, exportService);
    }
    res.render(TEMPLATE, model);
}

module.exports = {
    dispatch: dispatchRequest
};