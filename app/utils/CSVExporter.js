var fs = require('fs');

module.exports = (function () {

    var csv = require('fast-csv'),
        total = 0,
        fields = 0,
        filename,
        writeStream;

    function createWriteStream(outputFile, rootKeys) {
        console.log('outputFile:', outputFile);
        fields = rootKeys;
        filename = outputFile;
        writeStream = csv.createWriteStream({headers: true});

        var writableStream = fs.createWriteStream(filename);
        writableStream.on("finish", function () {
            console.log("DONE!");
        });

        writeStream.pipe(writableStream);
    }

    function end() {
        writeStream.end();
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
        writeStream.write(output);
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
