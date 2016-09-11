(function() {
  var progressHandler = require('../utility/progressHandler');
  var fileHandler = require('./fileHandler');
  var jsonParser = require('./jsonParser');

  var getOriginalAnimationData = function(collectAnimationData) {
    progressHandler.createSequence()
      .add(function(empty, collectCurrentlyLoadedFile) {
        fileHandler.getCurrentlyLoadedFile(collectCurrentlyLoadedFile);
      })
      .onEnd(function(currentlyLoadedFile) {
        jsonParser.getAnimationData(currentlyLoadedFile, collectAnimationData);
      });
  };

  var getKeyframeData = function(collectKeyframeData) {
    fileHandler.getCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.KEYFRAMES, collectKeyframeData);
  };

  var updateKeyframeData = function(keyframeData, done) {
    fileHandler.updateCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.KEYFRAMES, keyframeData, done);
  };

  var deleteKeyframeData = function(keys, done) {
    fileHandler.deleteEntriesFromCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.KEYFRAMES, keys, done);
  };

  module.exports.getOriginalAnimationData = getOriginalAnimationData;
  module.exports.getKeyframeData = getKeyframeData;
  module.exports.updateKeyframeData = updateKeyframeData;
  module.exports.deleteKeyframeData = deleteKeyframeData;

})();
