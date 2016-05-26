(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');

  var updateGlobalMaterial = base.extend({
    _actionName: "updateGlobalMaterial",

    run: function (done) {
      this._completed = true;
      materialHandler.updateGlobalMaterialDataFile(this._parameters.material.name, this._parameters.material, function (materialData) {
        this._parameters.revertData = materialData.originalData;
        done();
      }.bind(this));
    },

    revert: function (done) {
      this._completed = false;
      if (!this._parameters.revertData || !Object.keys(this._parameters.revertData).length) {
        materialHandler.deleteGlobalMaterial(this._parameters.material.name, done);
      } else {
        materialHandler.updateGlobalMaterialDataFile(this._parameters.material.name, this._parameters.revertData, done);
      }
    }
  });

  module.exports.create = updateGlobalMaterial;
})();