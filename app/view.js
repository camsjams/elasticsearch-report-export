var exphbs = require('express-handlebars');

function getString(input) {
    switch (typeof input) {
        case 'number':
        case 'boolean':
            input = input + '';
            break;
        case 'undefined':
        case 'null':
            input = '--';
            break;
        default:
        case 'object':
            input = JSON.stringify(input);
            break;
    }
    return input;
}

/**
 * {{ellipsis}}
 * @author: Jon Schlinkert <http://github.com/jonschlinkert>
 * Truncate the input string and removes all HTML tags
 * @param  {String} str      The input string.
 * @param  {Number} limit    The number of characters to limit the string.
 * @param  {String} append   The string to append if character are omitted.
 * @return {String}          The truncated string.
 */
function ellipsis(str, limit, append) {
    console.log(typeof str);
    if (typeof append !== 'string') {
        append = '&hellip;';
    }
    if (typeof str !== 'string') {
        str = getString(str);
    }
    var sanitized = str.replace(/(<([^>]+)>)/g, '');
    if (sanitized.length > limit) {
        return sanitized.substr(0, limit - append.length) + append;
    } else {
        return sanitized;
    }
}

function debug(data) {
    console.log('context:', this);
    console.log('data:', data);
}


function init(app, config) {
    // init view
    var hbConfig = config.hbs;
    hbConfig.helpers = {
        ellipsis: ellipsis,
        debug: debug
    };
    app.engine('.hbs', exphbs(hbConfig));
    app.set('view engine', '.hbs');
}

module.exports = {
    init: init
};