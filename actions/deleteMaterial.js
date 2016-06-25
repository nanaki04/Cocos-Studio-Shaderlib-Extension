(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');
  var progressHandler = require('../utility/progressHandler');

  var deleteMaterial = base.extend({
    _actionName: "deleteMaterial",

    run: function(done) {
      this._completed = true;
      this._parameters.revertData = {};
      progressHandler.createTracker(this._parameters)
        .add(function(parameters, _done) {
          materialHandler.deleteMaterialEntries([parameters.materialId], function(materialData) {
            parameters.revertData.materialData = materialData.originalData[parameters.materialId];
            _done();
          });
        })
        .add(function(parameters, _done) {
          materialHandler.deleteMaterialNodesEntries([parameters.materialId], function(materialNodesData) {
            parameters.revertData.materialNodesData = materialNodesData.originalData[parameters.materialId];
            _done();
          });
        })
        .onEnd(done);
    },

    revert: function(done) {
      this._completed = false;
      var materialData = {};
      var materialNodesData = {};
      materialData[this._parameters.materialId] = this._parameters.revertData.materialData;
      materialNodesData[this._parameters.materialId] = this._parameters.revertData.materialNodesData;
      progressHandler.createTracker()
        .add(function(empty, _done) {
          materialHandler.updateMaterialDataFile(materialData, _done);
        })
        .add(function(empty, _done) {
          materialHandler.updateMaterialNodesDataFile(materialNodesData, _done);
        })
        .onEnd(done);
    }
  });

  module.exports.create = deleteMaterial;
})();