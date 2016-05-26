(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');
  var progressHandler = require('../utility/progressHandler');

  var deleteGlobalMaterial = base.extend({
    _actionName: "deleteGlobalMaterial",

    run: function(done) {
      this._completed = true;

      progressHandler.createSequence()
        .add(function(empty, collectMaterial) {
          materialHandler.getGlobalMaterialDataFile(this._parameters.materialName, collectMaterial);
        })
        .onEnd(function(materialData) {
          this._parameters.revertData = materialData;
          materialHandler.deleteGlobalMaterial(materialData, done);
        }.bind(this));
    },

    revert: function(done) {
      this._completed = false;
      materialHandler.updateGlobalMaterialDataFile(this._parameters.materialName, this._parameters.revertData, done);
    }
  });

  module.exports.create = deleteGlobalMaterial;
})();