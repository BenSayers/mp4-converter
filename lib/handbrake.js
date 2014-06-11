var hbjs = require('handbrake-js');
var q = require('q');
var _ = require('underscore');

var getOptions = function (inputFile, outputFile, subtitleFile) {
    var handbrakeOptions = {
        input: inputFile,
        output: outputFile,
        preset: 'High Profile',
        'large-file': true,
        maxWidth: 1280,
        maxHeight: 720,
        'native-language': 'eng'
    };

    if (subtitleFile) {
        handbrakeOptions['srt-file'] = subtitleFile;
    } else {
        handbrakeOptions.subtitle = 'scan, 1,2,3,4,5,6,7,8,9,10';
    }

    return handbrakeOptions;
};

module.exports = {
    convert: function (inputFile, outputFile, subtitleFile) {
        var deferred = q.defer();

        var handbrake = hbjs.spawn(getOptions(inputFile, outputFile, subtitleFile));

        handbrake.on('error', function (error) {
            console.log('handbrake.error');
            console.log(handbrake.output);
            deferred.reject(error);
        });

        var logProgress = _.throttle(function (progress) {
            console.log(
                'Converting', inputFile, '-', progress.task, '-', progress.percentComplete, '%', progress.eta
            );
        }, 5000);

        handbrake.on('progress', function (progress) {
            logProgress(progress);
        });

        handbrake.on('end', function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
};