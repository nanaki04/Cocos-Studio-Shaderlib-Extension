(function() {
  var base = require('./action');
  var materialHandler = require('../data/materialHandler');
  var progressHandler = require('../utility/progressHandler');

  var newMaterial = base.extend({
    _actionName: "newMaterial",

    run: function(done) {
      this._completed = true;

      progressHandler.createSequence(this._parameters.material)
        .add(function(material, collectMaterialData) {
          materialHandler.generateMaterialId(function(id) {
            material.id = id;
            collectMaterialData(material);
          });
        })
        .onEnd(function(material) {
          var materialData = {};
          materialData[material.id] = material;
          materialHandler.updateMaterialDataFile(materialData, done);
        });
    },

    revert: function(done) {
      this._completed = false;
      materialHandler.deleteMaterialEntries([this._parameters.material.id], done);
    }
  });

  module.exports.create = newMaterial;
})();