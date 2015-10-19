const TEMPLATE = 'archive';

var config = require('../config');

function dispatchRequest(req, res) {
    var model = {
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
    };
    res.render(TEMPLATE, model);
}

module.exports = {
    dispatch: dispatchRequest
};