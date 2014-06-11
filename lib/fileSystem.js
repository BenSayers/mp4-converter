var config = require('../config.json');
var fs = require('fs');
var path = require('path');
var q = require('q');

var fileSystem = {
    emptyFolder: function (folder) {
        return fileSystem.filesIn(folder).then(function (files) {
            return q.all(files.map(function (file) {
                return fileSystem.remove(path.join(folder, file));
            }));
        });
    },
    exists: function (file) {
        var deferred = q.defer();

        fs.exists(file, function (exists) {
            deferred.resolve(exists);
        });

        return deferred.promise;
    },
    existsOrReject: function (file) {
        return fileSystem.exists(file).then(function (exists) {
            var deferred = q.defer();

            if (exists) {
                deferred.resolve();
            } else {
                deferred.reject('File does not exist: ', file);
            }

            return deferred.promise;
        });
    },
    filesIn: function (folder) {
        var deferred = q.defer();

        fs.readdir(folder, function (err, files) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(files);
            }
        });

        return deferred.promise;
    },
    moveFile: function (source, destination) {
        var deferred = q.defer();

        fs.rename(source, destination, function (error) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve();
            }
        });

        return deferred.proimse;
    },
    remove: function (file) {
        var removeIfExists = function (exists) {
            if (exists) {
                fileSystem.unlink(file);
            } else {
                return q();
            }
        };

        return fileSystem.exists(file).then(removeIfExists);
    },
    watch: function (folder, onFileAdded) {
        fs.watch(config.input, function (event, filename) {
            fileSystem.existsOrReject(path.join(folder, filename)).then(function () {
                onFileAdded(filename);
            });
        });
    },
    unlink: function (file) {
        var deferred = q.defer();

        fs.unlink(file, function (error) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }
};

module.exports = fileSystem;