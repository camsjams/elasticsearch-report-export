const APP_NAME = 'ere';
var config = require('rc')(APP_NAME, {
    port: 31337,
    elastic: {
        host: 'localhost',
        port: 9200
    },
    hbs: {
        extname: '.hbs',
        defaultLayout: 'main'
    },
    formats: [
        'csv'
    ]
});
console.log(config);
module.exports = config;