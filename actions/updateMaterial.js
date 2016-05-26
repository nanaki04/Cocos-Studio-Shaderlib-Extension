(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');

  var updateMaterial = base.extend({
    _actionName: "updateMaterial",

    run: function(done) {
      this._completed = true;
      var materialData = {};
      materialData[this._parameters.material.name] = this._parameters.material;
      materialHandler.updateMaterialDataFile(materialData, function(materialData) {
        this._parameters.revertData = materialData.originalData[this._parameters.material.name];
        done();
      }.bind(this));
    },

    revert: function(done) {
      this._completed = false;
      if (!this._parameters.revertData || !Object.keys(this._parameters.revertData).length) {
        materialHandler.deleteMaterialEntries([this._parameters.material.name], done);
      } else {
        var materialData = {};
        materialData[this._parameters.material.name] = this._parameters.revertData;
        materialHandler.updateMaterialDataFile(materialData, done);
      }
    }
  });

  module.exports.create = updateMaterial;
})();