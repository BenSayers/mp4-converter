var config = require('../config.json');
var fileSystem = require('./fileSystem.js');
var handbreak = require('./handbreak.js');
var path = require('path');

var generateOutputFileName = function (inputFile) {
    var inputFileArr = inputFile.split('.');
    inputFileArr.pop();
    inputFileArr.push('mp4');
    return inputFileArr.join('.');
};

var createFile = function (inputFile) {
    var outputFile = generateOutputFileName(inputFile);

    return {
        input: path.join(config.input, inputFile),
        output: path.join(config.output, outputFile),
        processed: path.join(config.processed, inputFile),
        working: path.join(config.working, outputFile)
    };
};

module.exports = {
    convert: function (inputFile) {
        var file = createFile(inputFile);

        var checkIfInputFileExists = function () {
            return fileSystem.exists(file.input);
        };

        var removeInputFileFromProcessedFolder = function () {
            return fileSystem.remove(file.processed);
        };

        var removeOutputFileFromOutputFolder = function () {
            return fileSystem.remove(file.output);
        };

        var emptyWorkingFolder = function () {
            return fileSystem.emptyFolder(config.working);
        };

        var convertFile = function () {
            return handbreak.convert(file.input, file.working);
        };

        var moveOutputFileToOutputFolder = function () {
            return fileSystem.moveFile(file.working, file.output);
        };

        var moveInputFileToProcessedFolder = function () {
            return fileSystem.moveFile(file.input, file.processed);
        };

        return checkIfInputFileExists()
            .then(removeInputFileFromProcessedFolder)
            .then(removeOutputFileFromOutputFolder)
            .then(emptyWorkingFolder)
            .then(convertFile)
            .then(moveOutputFileToOutputFolder)
            .then(moveInputFileToProcessedFolder);
    }
};