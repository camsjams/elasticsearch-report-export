const DOC_SPACE = '\t\t';
var argv = require('minimist')(process.argv.slice(2)),
    config = {
        port: 31337,
        elastic: {
            host: 'localhost',
            port: 9200
        }
    };

function getArguments() {
    if (argv) {
        if (argv.help) {
            console.log('options:\n',
                '-p' + DOC_SPACE + '\tport (31337)\n',
                '[--verbose]' + DOC_SPACE + 'enable more verbose logging (false)\n'
            );
            process.exit(1);
        } else {
            // extend config
        }
    }
}

getArguments();

module.exports = config;