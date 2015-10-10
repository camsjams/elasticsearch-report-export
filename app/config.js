const APP_NAME = 'ere';

var config = {
    port: 31337,
    elastic: {
        host: 'localhost',
        port: 9200,
        log: 'info',
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