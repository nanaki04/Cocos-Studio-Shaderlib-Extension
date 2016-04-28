(function() {
  var fs = require('fs');
  var progressHandler = require('../utility/progressHandler');
  var jsonParser = require('./jsonParser');
  var fileHandler = require('./fileHandler');

  var getNodeList = function(collectNodeList) {
    progressHandler.createSequence()
      .add(function(empty, collectCurrentlyLoadedFile) {
        fileHandler.getCurrentlyLoadedFile(collectCurrentlyLoadedFile);
      })
      .add(function(currentlyLoadedFile, done) {
        jsonParser.getNodeList(currentlyLoadedFile, "", done);
      })
      .onEnd(collectNodeList);
  };

  module.exports.getNodeList = getNodeList;

})();