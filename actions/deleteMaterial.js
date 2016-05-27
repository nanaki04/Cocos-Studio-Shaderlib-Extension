(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');

  var deleteMaterial = base.extend({
    _actionName: "deleteMaterial",

    run: function(done) {
      this._completed = true;
      materialHandler.deleteMaterialEntries([this._parameters.materialId], function(materialData) {
        this._parameters.revertData = materialData.originalData[this._parameters.materialId];
        done();
      }.bind(this));
    },

    revert: function(done) {
      this._completed = false;
      var materialData = {};
      materialData[this._parameters.materialId] = this._parameters.revertData;
      materialHandler.updateMaterialDataFile(materialData, done);
    }
  });

  module.exports.create = deleteMaterial;
})();