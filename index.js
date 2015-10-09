var config = require('./app/config'),
    express = require('express'),
    hbs = require('express-handlebars'),
    app = express(),
    server;

// init view
app.engine('.hbs', hbs(config.hbs));
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    res.render('home', {
        formats: config.formats
    });
});

app.get('/archive', function (req, res) {
    res.render('archive', {
        items: [
            {
                name: '1.csv',
                href: '/cache/1.csv'
            },
            {
                name: '2.csv',
                href: '/cache/2.csv'
            }
        ]
    });
});

app.post('/export', function (req, res) {
    res.render('export');
});


//app.use(express.static('public'));

server = app.listen(config.port, function () {
    console.log('ERE listening at http://localhost:%s', server.address().port);
});