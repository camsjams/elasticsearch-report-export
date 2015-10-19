var fs = require('fs');

var CSVExporter = (function () {

    var csv = require('fast-csv'),
        total = 0,
        fields = 0,
        filename,
        csvStream;

    function createWriteStream(outputFile, rootKeys) {
        console.log('outputFile:', outputFile);
        fields = rootKeys;
        filename = outputFile;
        csvStream = csv.createWriteStream({headers: true});

        var writableStream = fs.createWriteStream(filename);
        writableStream.on("finish", function () {
            console.log("DONE!");
        });

        csvStream.pipe(writableStream);
    }

    function end() {
        csvStream.end();
    }

    function write(data) {
        var output = {};
        total++;
        for (var k in fields) {
            var fieldName = fields[k];
            if (data[fieldName]) {
                output[fieldName] = data[fieldName];
            }
        }
        csvStream.write(output);
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
    csv: CSVExporter
};