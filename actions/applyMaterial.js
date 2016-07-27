(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');
  var selectionHandler = require('../data/selectionHandler');
  var progressHandler = require('../utility/progressHandler');

  //node selection identifier
  //material id
  var applyMaterial = base.extend({
    _actionName: "applyMaterial",

    run: function(done) {
      this._completed = true;
      progressHandler.createSequence({
        parameters: this._parameters
      })
        .add(function(data, _done) {
          selectionHandler.getSelection(data.parameters.selection, function(selection) {
            data.selection = selection;
            _done(data);
          });
        })
        .onEnd(function(data) {
          var updatedData = {};
          updatedData[data.parameters.materialId] = data.selection;
          materialHandler.updateMaterialNodesDataFile(updatedData, function(result) {
            data.parameters.revertData = result.originalData[data.parameters.materialId];
            done();
          });
        });
    },

    revert: function(done) {
      this._completed = false;
      var parameters = this._parameters;
      if (parameters.revertData == null) {
        materialHandler.deleteMaterialNodesEntry([parameters.material]);
      } else {
        var revertedData = {};
        revertedData[parameters.material] = parameters.revertData;
        materialHandler.updateMaterialNodesDataFile(revertedData, done);
      }
    }
  });

  module.exports.create = applyMaterial;
})();