var Mapper = function () {
    var mapHash = {};

    function getMapping(indexName, typeName) {
        var client = new elasticsearch.Client({
            host: config.elastic.host + ':' + config.elastic.port,
            log: config.elastic.log
        });

        client.indices.getMapping(
            {
                index: indexName,
                type: typeName
            }
            , function (err, mapping) {
                // todo null check/error check
                Object.keys(mapping[indexName].mappings[typeName].properties);
            });
    }

    return {
        getMapping: getMapping
    }
};

module.exports = new Mapper();