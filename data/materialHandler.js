(function() {
  var fs = require('fs');
  var fileHandler = require('./fileHandler');
  var progressHandler = require('../utility/progressHandler');

  var GLOBAL_MATERIAL_FOLDER = "data/materialData";
  var ID_INFO_FILE = "IDinfo.json";

  var getGlobalMaterialList = function(collectMaterials) {
    fs.readdir(GLOBAL_MATERIAL_FOLDER, function(err, files) {
      files = files.map(function(file) {
        return file.replace(GLOBAL_MATERIAL_FOLDER + "/", "").replace(/\.json/gi, "");
      });
      collectMaterials(files);
    });
  };

  var getGlobalMaterialDataFile = function(materialId, collectFileData) {
    progressHandler.createSequence()
      .add(function(empty, collectMaterialList) {
        getGlobalMaterialList(collectMaterialList);
      })
      .onEnd(function(materialList) {
        if (~materialList.indexOf(materialId)) {
          fs.readFile(_getGlobalMaterialPath(materialId), function(err, data) {
            collectFileData(JSON.parse(data));
          });
        }
        fs.writeFile(_getGlobalMaterialPath, JSON.stringify({}), collectFileData({}));
      });
  };

  var updateGlobalMaterialDataFile = function(materialId, materialData, collectDataInfo) {
    progressHandler.createSequence(materialId)
      .add(getGlobalMaterialDataFile)
      .onEnd(function(currentMaterialData) {
        var newMaterialData = Object.keys(currentMaterialData).reduce(function(_newMaterialData, key) {
          _newMaterialData[key] = currentMaterialData[key];
          return _newMaterialData;
        }, {});
        Object.keys(materialData).forEach(function(key) {
          newMaterialData[key] = materialData[key];
        });
        fs.writeFile(_getGlobalMaterialPath(materialId), JSON.stringify(newMaterialData), function(err, data) {
          collectDataInfo({
            originalData: currentMaterialData,
            updatedData: newMaterialData
          });
        });
      })
  };

  var deleteGlobalMaterial = function(materialId, done) {
    fs.unlink(_getGlobalMaterialPath(materialId), done);
  };

  var _getGlobalMaterialPath = function(materialId) {
    return GLOBAL_MATERIAL_FOLDER + "/" + materialId + ".json";
  };

  var generateMaterialId = function(collectId) {
    progressHandler.createSequence()
      .add(function(empty, collectIdData) {
        fs.readFile(GLOBAL_MATERIAL_FOLDER + "/" + ID_INFO_FILE, function(err, data) {
          collectIdData(JSON.parse(data));
        });
      })
      .onEnd(function(idData) {
        idData.lastId++;
        fs.writeFile(GLOBAL_MATERIAL_FOLDER + "/" + ID_INFO_FILE, JSON.stringify(idData), function(err) {
          collectId(idData.lastId);
        });
      });
  };

  var getMaterial = function(id, collectMaterial) {
    getMaterialDataFile(function(materialData) {
      if (materialData[id] == null) {
        getGlobalMaterial(id, collectMaterial);
        return;
      }
      collectMaterial(materialData[id]);
    });
  };

  var getGlobalMaterial = function(id, collectMaterial) {
    //todo
    return collectMaterial({});
    //getGlobalMaterialDataFile(id, collectMaterial);
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

  var getMaterialNodesDataFile = function(collectFileData) {
    fileHandler.getCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.MATERIAL_NODES, collectFileData);
  };

  var updateMaterialNodesDataFile = function(materialNodeData, done) {

    var removeDuplicateNodeEntries = function(originalMaterialNodeData, newMaterialNodeData) {
      var newDataKeys = Object.keys(newMaterialNodeData);
      var originalDataKeys = Object.keys(originalMaterialNodeData);

      console.log("ORIGINAL DATA");

      newDataKeys.forEach(function(newDataKey) {
        originalDataKeys.forEach(function(originalDataKey) {
          if (newDataKey === originalDataKey) {
            return;
          }

          console.log(originalDataKey);

          var newNodeList = newMaterialNodeData[newDataKey];
          var originalNodeList = originalMaterialNodeData[originalDataKey];

          console.log(originalNodeList);

          newNodeList.forEach(function(nodeId) {
            var index = originalNodeList.indexOf(nodeId);
            if (~index) {
              originalNodeList.splice(index, 1);
            }
          });
        });
      });
    };

    var overwriteNewData = function(originalMaterialNodeData, newMaterialNodeData) {
      var newDataKeys = Object.keys(newMaterialNodeData);
      newDataKeys.forEach(function(newDataKey) {
        originalMaterialNodeData[newDataKey] = newMaterialNodeData[newDataKey];
      });
    };

    progressHandler.createSequence()
      .add(function(empty, collectMaterialNodesFileData) {
        getMaterialNodesDataFile(function(materialFileData) {
          removeDuplicateNodeEntries(materialFileData, materialNodeData);
          overwriteNewData(materialFileData, materialNodeData);
          collectMaterialNodesFileData(materialFileData);
        });
      })
      .onEnd(function(_materialNodeData) {
        fileHandler.updateCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.MATERIAL_NODES, _materialNodeData, done);
      });
  };

  var deleteMaterialNodesEntries = function(materialIdList, done) {
    fileHandler.deleteEntriesFromCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.MATERIAL_NODES, materialIdList, done);
  };

  module.exports.getGlobalMaterialList = getGlobalMaterialList;
  module.exports.getGlobalMaterialDataFile = getGlobalMaterialDataFile;
  module.exports.updateGlobalMaterialDataFile = updateGlobalMaterialDataFile;
  module.exports.deleteGlobalMaterial = deleteGlobalMaterial;
  module.exports.getMaterialDataFile = getMaterialDataFile;
  module.exports.updateMaterialDataFile = updateMaterialDataFile;
  module.exports.deleteMaterialEntries = deleteMaterialEntries;
  module.exports.generateMaterialId = generateMaterialId;
  module.exports.getMaterial = getMaterial;
  module.exports.getMaterialNodesDataFile = getMaterialNodesDataFile;
  module.exports.updateMaterialNodesDataFile = updateMaterialNodesDataFile;
  module.exports.deleteMaterialNodesEntry = deleteMaterialNodesEntries;
})();
