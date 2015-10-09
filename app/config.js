const APP_NAME = 'ere';

var config = {
    port: 31337,
    elastic: {
        host: '192.168.216.240',
        port: 9200,
        log: 'info'
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