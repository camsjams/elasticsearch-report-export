function exportData(req) {
    console.log('format', req.body.format);
    console.log(req['raw-query']);
}


module.exports = {
    dispatch: exportData
};