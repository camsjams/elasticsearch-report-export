const TEMPLATE = 'export';

var elasticsearch = require('elasticsearch'),
    exp = require('../services/ExportService'),
    mapServ = require('../services/MappingService'),
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

    mapServ.getMapping(model.indexName, model.typeName)
        .then(function (fieldMap) {
            expSvc.createWriteStream(
                config.outputDirectory + model.filename,
                fieldMap
            );
            client.search({
                index: model.indexName,
                scroll: config.elastic.scrollTime,
                search_type: 'scan',
                body: model.query
            }, function getMoreUntilDone(error, response) {
                response.hits.hits.forEach(function (hit) {
                    expSvc.write(hit._source ? hit._source : hit.fields);
                });
                if (response.hits.total > expSvc.getTotal()) {
                    client.scroll({
                        scrollId: response._scroll_id,
                        scroll: config.elastic.scrollTime
                    }, getMoreUntilDone);
                } else {
                    console.log('exportData completed', expSvc.getTotal());
                    expSvc.end();
                }
            });
        }).catch(function (err) {
            console.log('exportData catch', err, model);
        });
}

function dispatchRequest(req, res) {
    var rawQuery = req.body.rawQuery,
        format = req.body.format,
        exportService = exp[format] ? exp[format]() : null,
        query = JSON.parse(rawQuery),
        model;

    model = {
        filename: getFileName(rawQuery, format),
        rawQuery: rawQuery,
        indexName: req.body.indexName,
        typeName: req.body.typeName,
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