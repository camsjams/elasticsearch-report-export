var fs = require('fs');

var CSVExporter = (function () {

    var csv = require('fast-csv'),
        total = 0,
        filename,
        csvStream;

    function createWriteStream(outputFile) {
        console.log('outputFile:', outputFile);
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
        total++;
        console.log('write', data);
        csvStream.write({title: data});
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