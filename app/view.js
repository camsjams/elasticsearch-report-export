var exphbs = require('express-handlebars'),
    tagOpenCache = {},
    tagCloseCache = {};

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

function getTagOpener(tag) {
    if (!tagOpenCache[tag]) {
        tagOpenCache[tag] = '<' + tag + '>';
    }
    return tagOpenCache[tag];
}

function getTagCloser(tag) {
    if (!tagCloseCache[tag]) {
        tagCloseCache[tag] = '</' + tag + '>';
    }
    return tagCloseCache[tag];
}

/**
 * {{{printWithKeys source keys "td"}}}
 * @author: Cameron Manavian
 * Return listing of source object using mapping keys, inside element of string type tag
 * @param  {Object} source      The input object
 * @param  {Object} keys        The whitelist of keys
 * @param  {String} tag         The tag name to wrap each item in
 * @return {String}             The html output string.
 */
function printWithKeys(source, keys, tag) {
    var output = '';
    for (var i in keys) {
        var fieldName = keys[i];
        if (source[fieldName]) {
            output += getTagOpener(tag) + source[fieldName] + getTagCloser(tag);
        } else {
            output += getTagOpener(tag) + '--' + getTagCloser(tag);
        }
    }
    return output;
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
        printWithKeys: printWithKeys,
        debug: debug
    };
    app.engine('.hbs', exphbs(hbConfig));
    app.set('view engine', '.hbs');
}

module.exports = {
    init: init
};