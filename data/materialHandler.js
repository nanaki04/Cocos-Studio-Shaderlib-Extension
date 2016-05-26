(function() {
  var fs = require('fs');
  var fileHandler = require('./fileHandler');
  var progressHandler = require('../utility/progressHandler');

  var GLOBAL_MATERIAL_FOLDER = "data/materialData";

  var getGlobalMaterialList = function(collectMaterials) {
    fs.readdir(GLOBAL_MATERIAL_FOLDER, function(err, files) {
      files = files.map(function(file) {
        return file.replace(GLOBAL_MATERIAL_FOLDER + "/", "").replace(/\.json/gi, "");
      });
      collectMaterials(files);
    });
  };

  var getGlobalMaterialDataFile = function(materialName, collectFileData) {
    progressHandler.createSequence()
      .add(function(empty, collectMaterialList) {
        getGlobalMaterialList(collectMaterialList);
      })
      .onEnd(function(materialList) {
        if (~materialList.indexOf(materialName)) {
          fs.readFile(_getGlobalMaterialPath(materialName), function(err, data) {
            collectFileData(JSON.parse(data));
          });
        }
        fs.writeFile(_getGlobalMaterialPath, JSON.stringify({}), collectFileData({}));
      });
  };

  var updateGlobalMaterialDataFile = function(materialName, materialData, collectDataInfo) {
    progressHandler.createSequence(materialName)
      .add(getGlobalMaterialDataFile)
      .onEnd(function(currentMaterialData) {
        var newMaterialData = Object.keys(currentMaterialData).reduce(function(_newMaterialData, key) {
          _newMaterialData[key] = currentMaterialData[key];
          return _newMaterialData;
        }, {});
        Object.keys(materialData).forEach(function(key) {
          newMaterialData[key] = materialData[key];
        });
        fs.writeFile(_getGlobalMaterialPath(materialName), JSON.stringify(newMaterialData), function(err, data) {
          collectDataInfo({
            originalData: currentMaterialData,
            updatedData: newMaterialData
          });
        });
      })
  };

  var deleteGlobalMaterial = function(materialName, done) {
    fs.unlink(_getGlobalMaterialPath(materialName), done);
  };

  var _getGlobalMaterialPath = function(materialName) {
    return GLOBAL_MATERIAL_FOLDER + "/" + materialName + ".json";
  };

  var getMaterialDataFile = function(collectFileData) {
    fileHandler.getCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.MATERIALS, collectFileData);
  };

  var updateMaterialDataFile = function(data, done) {
    fileHandler.updateCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.MATERIALS, data, done);
  };

  var deleteMaterialEntries = function(materialList, done) {
    fileHandler.deleteEntriesFromCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.MATERIALS, materialList, done);
  };

  module.exports.getGlobalMaterialList = getGlobalMaterialList;
  module.exports.getGlobalMaterialDataFile = getGlobalMaterialDataFile;
  module.exports.updateGlobalMaterialDataFile = updateGlobalMaterialDataFile;
  module.exports.deleteGlobalMaterial = deleteGlobalMaterial;
  module.exports.getMaterialDataFile = getMaterialDataFile;
  module.exports.updateMaterialDataFile = updateMaterialDataFile;
  module.exports.deleteMaterialEntries = deleteMaterialEntries;
});
