const APP_NAME = 'ere';

var config = {
    port: 31337,
    outputDirectory: __dirname + '/../cache/',
    elastic: {
        host: 'localhost',
        port: 9200,
        log: 'info',
        scrollTime: '30s',
        pageSize: 600
    },
    hbs: {
        extname: '.hbs',
        defaultLayout: 'main'
    },
    formats: [
        'csv'
    ]
};

config = require('rc')(APP_NAME, config);

module.exports = config;