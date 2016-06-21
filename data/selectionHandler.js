(function() {
  var progressHandler = require('../utility/progressHandler');
  var projectHandler = require('./projectHandler');
  var fileHandler = require('./fileHandler');

  var addToCurrentSelection = function(nodes, done) {
    var sequence = progressHandler.createSequence();
    sequence.add(function(value, collectCurrentSelection) {
      getCurrentSelection(collectCurrentSelection);
    });
    sequence.onEnd(function(selection) {
      console.log("adding to current selection");
      console.log(selection);
      console.log(nodes);
      (nodes || []).forEach(function(node) {
        console.log(node);
        console.log(selection.indexOf(node));
        if (!~selection.indexOf(node)) {
          selection.push(node);
        }
      });
      updateSelectionDataFile({currentSelection: selection}, done);
    });
  };

  var removeFromCurrentSelection = function(nodes, done) {
    var sequence = progressHandler.createSequence();
    sequence.add(function(value, collectCurrentSelection) {
      getCurrentSelection(collectCurrentSelection);
    });
    sequence.onEnd(function(selection) {
      (nodes || []).forEach(function(node) {
        var index = selection.indexOf(node);
        if (~index) {
          selection.splice(index, 1);
        }
      });
      updateSelectionDataFile({currentSelection: selection}, done);
    });
  };

  var clearCurrentSelection = function(done) {
    updateSelectionDataFile({currentSelection: []}, done);
  };

  var getCurrentSelection = function(collectCurrentSelection) {
    getSelectionDataFile(function(selectionData) {
      collectCurrentSelection(selectionData.currentSelection || []);
    });
  };

  var getSelection = function(identifier, collectSelection) {
    getSelectionDataFile(function(selectionData) {
      collectSelection((selectionData && selectionData[identifier]) || {});
    });
  };

  var saveSelection = function(selection, identifier, done) {

  };

  var loadSelection = function(identifier, collectSelection) {

  };

  var deleteSelection = function(identifier, done) {

  };


  var getSelectionDataFile = function(collectFileData) {
    fileHandler.getCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.SELECTION, collectFileData);
  };

  var updateSelectionDataFile = function(data, done) {
    fileHandler.updateCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.SELECTION, data, done);
  };

  module.exports.addToCurrentSelection = addToCurrentSelection;
  module.exports.removeFromCurrentSelection = removeFromCurrentSelection;
  module.exports.clearCurrentSelection = clearCurrentSelection;
  module.exports.getCurrentSelection = getCurrentSelection;
  module.exports.getSelection = getSelection;
  module.exports.saveSelection = saveSelection;
  module.exports.loadSelection = loadSelection;
  module.exports.deleteSelection = deleteSelection;

})();