var converter = require('./converter.js');

var queue = [];
var processing = false;

var processQueue = function () {
    if (processing || queue.length === 0) {
        return;
    }

    processing = true;

    console.log('\nItems in queue:', queue.length);

    var inputFile = queue.shift();

    console.log('Processing file:', inputFile);

    var logSuccess = function () {
        console.log('File successfully converted: ', inputFile);
    };

    var logError = function (error) {
        console.log('Error processing file:', inputFile, '\nDetails:', error);
    };

    converter.convert(inputFile).then(logSuccess, logError).fin(function () {
        processing = false;
        processQueue();
    });
};

module.exports = {
    add: function (file) {
        console.log('File added:', file);

        queue.push(file);
        processQueue();
    }
};