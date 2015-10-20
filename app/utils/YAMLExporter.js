var fs = require('fs');

var Exporter = (function () {

    var total = 0;

    function createWriteStream(outputFile, rootKeys) {
    }

    function end() {
    }

    function write(data) {
    }

    function getTotal() {
        return total;
    }

    return {
        createWriteStream: createWriteStream,
        end: end,
        getTotal: getTotal,
        write: write
    }
});

module.exports = {
    exporter: Exporter
};