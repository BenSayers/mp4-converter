var fileSystem = require('./lib/fileSystem.js');
var converterQueue = require('./lib/converter-queue.js');
var config = require('./config.json');

fileSystem.watch(config.input, function (file) {
    converterQueue.add(file);
});

fileSystem.filesIn(config.input).then(function (files) {
    files.forEach(converterQueue.add);
});