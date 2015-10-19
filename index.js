var config = require('./app/config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    view = require('./app/view'),
    app = express(),
    server;

function getController(name) {
    return require('./app/controllers/' + name + 'Controller');
}

app.use(bodyParser.urlencoded({extended: false}));
view.init(app, config);

app.get('/', function (req, res) {
    res.render('home', {
        formats: config.formats
    });
});

app.get('/archive', function (req, res) {
    getController('Archive').dispatch(req, res);
});

app.post('/report', function (req, res) {
    getController('Report').dispatch(req, res);
});

app.post('/export', function (req, res) {
    getController('Export').dispatch(req, res);
});

server = app.listen(config.port, function () {
    console.log('ERE listening at http://localhost:%s', server.address().port);
});