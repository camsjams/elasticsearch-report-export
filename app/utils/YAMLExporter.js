var fs = require('fs');

module.exports = (function () {

    var total = 0;

    function createWriteStream(outputFile, rootKeys) {
    }

    function end() {
    }

    function write(data) {
        total++;
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