var config = require('../config.json');
var fileSystem = require('./fileSystem.js');
var handbrake = require('./handbrake.js');
var path = require('path');
var q = require('q');

var changeFileExtensionTo = function (file, extension) {
    var fileArr = file.split('.');
    fileArr.pop();
    fileArr.push(extension);
    return fileArr.join('.');
};

var createFile = function (inputFile) {
    var outputFile = changeFileExtensionTo(inputFile, 'mp4');
    var subtitleFile = changeFileExtensionTo(inputFile, 'srt');

    return {
        input: path.join(config.input, inputFile),
        output: path.join(config.output, outputFile),
        processed: path.join(config.processed, inputFile),
        subtitleInput: path.join(config.input, subtitleFile),
        subtitleProcessed: path.join(config.processed, subtitleFile),
        working: path.join(config.working, outputFile)
    };
};

module.exports = {
    convert: function (inputFile) {
        var file = createFile(inputFile);

        var checkIfInputFileExists = function () {
            return fileSystem.existsOrReject(file.input);
        };

        var removeInputFileFromProcessedFolder = function () {
            return fileSystem.remove(file.processed);
        };

        var removeSubtitleFileFromProcessedFolder = function () {
            return fileSystem.remove(file.subtitleProcessed);
        };

        var removeOutputFileFromOutputFolder = function () {
            return fileSystem.remove(file.output);
        };

        var emptyWorkingFolder = function () {
            return fileSystem.emptyFolder(config.working);
        };

        var getSubtitleFile = function () {
            return fileSystem.exists(file.subtitleInput).then(function (exists) {
                if (exists) {
                    return file.subtitleInput;
                } else {
                    return null;
                }
            });
        };

        var convertFile = function (subtitleFile) {
            return handbrake.convert(file.input, file.working, subtitleFile);
        };

        var moveOutputFileToOutputFolder = function () {
            return fileSystem.moveFile(file.working, file.output);
        };

        var moveInputFileToProcessedFolder = function () {
            return fileSystem.moveFile(file.input, file.processed);
        };

        var moveSubtitleFileToProcessedFolder = function () {
            return fileSystem.moveFile(file.subtitleInput, file.subtitleProcessed);
        };

        return checkIfInputFileExists()
            .then(removeInputFileFromProcessedFolder)
            .then(removeSubtitleFileFromProcessedFolder)
            .then(removeOutputFileFromOutputFolder)
            .then(emptyWorkingFolder)
            .then(getSubtitleFile)
            .then(convertFile)
            .then(moveOutputFileToOutputFolder)
            .then(moveInputFileToProcessedFolder)
            .then(moveSubtitleFileToProcessedFolder);
    }
};