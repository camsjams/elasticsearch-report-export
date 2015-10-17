var config = require('../config'),
    elasticsearch = require('elasticsearch'),
    mapHash = {};

function getMapping(indexName, typeName) {
    return new Promise(function (resolve, reject) {
        var client,
            keyName = indexName + '_' + typeName;

        if (mapHash[keyName]) {
            resolve(mapHash[keyName]);
        } else {
            client = new elasticsearch.Client({
                host: config.elastic.host + ':' + config.elastic.port,
                log: config.elastic.log
            });
            client.indices.getMapping(
                {
                    index: indexName,
                    type: typeName
                }
                , function (err, mapping) {
                    if (err) {
                        reject(err);
                    } else if (mapping[indexName] &&
                        mapping[indexName].mappings &&
                        mapping[indexName].mappings[typeName] &&
                        mapping[indexName].mappings[typeName].properties
                    ) {
                        mapHash[keyName] = Object.keys(mapping[indexName].mappings[typeName].properties);
                        resolve(mapHash[keyName]);
                    } else {
                        resolve(null);
                    }
                });
        }
    });
}

module.exports = {
    getMapping: getMapping
};
