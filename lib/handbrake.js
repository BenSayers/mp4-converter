var hbjs = require('handbrake-js');
var q = require('q');
var _ = require('lodash');

var getHandbrakeOptions = function (options) {
    var handbrakeOptions = {
        input: options.inputFile,
        output: options.outputFile,
        preset: 'High Profile',
        'large-file': true,
        maxWidth: 1920,
        maxHeight: 1080,
        'native-language': 'eng'
    };

    if (options.subtitleFile) {
        handbrakeOptions['srt-file'] = options.subtitleFile;
    } else {
        handbrakeOptions.subtitle = 'scan, 1,2,3,4,5,6,7,8,9,10';
    }

    if (options.partialConvert.enabled) {
        handbrakeOptions['start-at'] = 'duration:' + options.partialConvert.start;
        handbrakeOptions['stop-at'] = 'duration:' + options.partialConvert.duration;
    }

    return handbrakeOptions;
};

module.exports = {
    convert: function (options) {
        var deferred = q.defer();

        var handbrake = hbjs.spawn(getHandbrakeOptions(options));

        handbrake.on('error', function (error) {
            console.log('handbrake.error');
            console.log(handbrake.output);
            deferred.reject(error);
        });

        var logProgress = _.throttle(function (progress) {
            console.log(
                'Converting', options.inputFile, '-', progress.task, '-', progress.percentComplete, '%', progress.eta
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
