var hbjs = require('handbrake-js');
var q = require('q');
var _ = require('underscore');

module.exports = {
    convert: function (inputFile, outputFile) {
        var deferred = q.defer();

        var handbreak = hbjs.spawn({
            'input': inputFile,
            'output': outputFile,
            'preset': 'High Profile',
            'large-file': true,
            'maxWidth': 1280,
            'maxHeight': 720,
            'subtitle': 'scan, 1,2,3,4,5,6,7,8,9,10',
            'native-language': 'eng'
        });

        handbreak.on('error', function (error) {
            console.log('handbreak.error');
            console.log(handbreak.output);
            deferred.reject(error);
        });

        var logProgress = _.throttle(function (progress) {
            console.log('Converting ', inputFile, ' - ', progress.percentComplete, '%, eta ', progress.eta);
        }, 5000);

        handbreak.on('progress', function (progress) {
            logProgress(progress);
        });

        handbreak.on('end', function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
};