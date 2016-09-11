(function() {
  var fs = require('fs');
  var progressHandler = require('../utility/progressHandler');
  var projectHandler = require('./projectHandler');
  var jsonParser = require('./jsonParser');
  var jsonBuilder = require('./jsonBuilder');
  var paths = require('../communication/paths');
  var queue = require('../utility/queue');

  var FILE_DATA_TYPES = {
    HISTORY: "_HISTORY",
    SELECTION: "_SELECTION",
    MATERIALS: "_MATERIALS",
    MATERIAL_NODES: "_MATERIAL_NODES",
    KEYFRAMES: "_KEYFRAMES"
  };

  var EXPORT_PATH = "exports";

  var fileAccessQueues = function(fileDataTypes) {
    var keys = Object.keys(fileDataTypes);
    return keys.reduce(function(queues, key) {
      queues[fileDataTypes[key]] = new queue.Queue();
      return queues;
    }, {});
  }(FILE_DATA_TYPES);

  var getJSONs = function(collectData) {
    projectHandler.getCurrentProject(function(currentProject) {
      _loopDirectory("projects/" + currentProject, function(fileList) {
        var jsonList = _extractFileTypes(fileList, ".json");
        collectData({
          jsonList: jsonList
        });
      });
    });
  };

  var updateCurrentlyLoadedFile = function(file, done) {
    projectHandler.updateProjectSpecificData({
      currentlyLoadedFile: file
    }, done);
  };

  var getCurrentlyLoadedFile = function(collectCurrentlyLoadedFile) {
    projectHandler.getProjectSpecificData(function(projectSpecificData) {
      collectCurrentlyLoadedFile(projectSpecificData.currentlyLoadedFile);
    });
  };

  var getResourceList = function(root, collectData) {
    _loopDirectory(root, collectData);
  };

  var generateResourceFile = function(path, done) {
    jsonParser.parseJson(path, function(resourceList) {
      resourceList.unshift(path.replace(/^projects\//, ""));
      projectHandler.writeResourceFileList(resourceList, done);
    });
  };

  var _getFileDataPath = function(filePath, type, collectFileDataPath) {
    progressHandler.createSequence({})
      .add(function(fileData, done) {
        projectHandler.getProjectSpecificDataFolder(function(projectSpecificDataFolder) {
          fileData.projectSpecificDataFolder = projectSpecificDataFolder;
          fileData.filePath = filePath;
          done(fileData);
        });
      })
      .add(function(fileData, collectFileName) {
        fs.readdir(fileData.projectSpecificDataFolder, function(err, files) {
          var fileName = (fileData.filePath.replace(/\.json/gi, "") + type + ".json").replace(/\//g, "_");
          var fileDataPath = fileData.projectSpecificDataFolder + "/" + fileName;

          if (files.some(function(file) {
              return file === fileName;
            })) {
            collectFileName(fileDataPath);
            return;
          }

          fs.writeFile(fileDataPath, JSON.stringify({}), function() {
            collectFileName(fileDataPath);
          });
        });
      })
      .onEnd(collectFileDataPath);
  };

  var getCurrentlyLoadedFileData = function(type, collectCurrentlyLoadedFileData) {
    getCurrentlyLoadedFile(function(currentlyLoadedFile) {
      getFileData(currentlyLoadedFile, type, collectCurrentlyLoadedFileData);
    });
  };

  var getFileData = function(file, type, collectCurrentlyLoadedFileData) {
    _getFileDataPath(file, type, function(fileDataPath) {
      //todo make queues for currently accessing file only
      fileAccessQueues[type].enqueue(function(empty, unlockFileAccess) {
        fs.readFile(fileDataPath, function (err, data) {
          unlockFileAccess();
          collectCurrentlyLoadedFileData(JSON.parse(data), fileDataPath);
        });
      });
    });
  };

  var updateCurrentlyLoadedFileData = function(type, data, done) {
    getCurrentlyLoadedFile(function(currentlyLoadedFile) {
      updateFileData(currentlyLoadedFile, type, data, done);
    });
  };

  var updateFileData = function(file, type, data, done) {
    progressHandler.createSequence({})
      .add(function(result, collectFileData) {
        getFileData(file, type, function(fileData, fileDataPath) {
          result.originalData = fileData;
          result.fileDataPath = fileDataPath;
          collectFileData(result);
        });
      })
      .onEnd(function(result) {
        var keys = Object.keys(data);
        var updatedData = keys.reduce(function(_updatedData, key) {
          _updatedData[key] = data[key];
          return _updatedData;
        }, result.originalData);

        result.updatedData = updatedData;

        //todo make queues for currently accessing file only
        fileAccessQueues[type].enqueue(function(empty, unlockFileAccess) {
          fs.writeFile(result.fileDataPath, JSON.stringify(updatedData), function() {
            unlockFileAccess();
            done(result);
          });
        });
      });
  };

  var deleteEntriesFromCurrentlyLoadedFileData = function(type, entryKeys, done) {
    getCurrentlyLoadedFile(function(currentlyLoadedFile) {
      deleteEntriesFromFileData(currentlyLoadedFile, type, entryKeys, done);
    });
  };

  var deleteEntriesFromFileData = function(file, type, entryKeys, done) {
    progressHandler.createSequence({})
      .add(function (result, collectFileData) {
        getFileData(file, type, function (fileData, fileDataPath) {
          result.originalData = fileData;
          result.fileDataPath = fileDataPath;
          collectFileData(result);
        });
      })
      .onEnd(function (result) {
        var updatedData = entryKeys.reduce(function (_updatedData, key) {
          delete _updatedData[key];
          return _updatedData;
        }, result.originalData);

        result.updatedData = updatedData;

        //todo make queues for currently accessing file only
        fileAccessQueues[type].enqueue(function(empty, unlockFileAccess) {
          fs.writeFile(result.fileDataPath, JSON.stringify(updatedData), function () {
            unlockFileAccess();
            done(result);
          });
        });
      });
  };

  var exportCurrentlyLoadedFile = function(done) {
    getCurrentlyLoadedFile(function(currentlyLoadedFile) {
      exportFile(currentlyLoadedFile, done);
    });
  };

  var exportFile = function(file, done) {
    progressHandler.createSequence(file)
      .add(function(_file, collectJson) {
        _loadJson(_file, collectJson);
      })
      .add(function(json, collectUpdatedJson) {
        _appendDataToJson(json, file, collectUpdatedJson);
      })
      .onEnd(function(updatedJson) {
        _writeExportFile(updatedJson, file, done);
      });
  };

  var _loadJson = function(path, collectJson) {
    fs.readFile(path, function(err, json) {
      collectJson(JSON.parse(json));
    });
  };

  var _appendDataToJson = function(json, file, collectUpdatedJson) {
    progressHandler.createTracker(json)
      .add(function(_json, _collectUpdatedJson) {
        _appendMaterialDataToJson(_json, file, _collectUpdatedJson);
      })
      .add(function(_json, _collectUpdatedJson) {
        _appendMaterialNodeDataToJson(_json, file, _collectUpdatedJson);
      })
      .onEnd(collectUpdatedJson);
  };

  var _appendMaterialDataToJson = function(json, file, collectUpdatedJson) {
    progressHandler.createSequence()
      .add(function(empty, collectFileData) {
        getFileData(file, FILE_DATA_TYPES.MATERIALS, collectFileData);
      })
      .onEnd(function(materialData) {
        jsonBuilder.appendMaterialData(json, materialData);
        collectUpdatedJson(json);
      });
  };

  var _appendMaterialNodeDataToJson = function(json, file, collectUpdatedJson) {
    progressHandler.createSequence()
      .add(function(empty, collectFileData) {
        getFileData(file, FILE_DATA_TYPES.MATERIAL_NODES, collectFileData);
      })
      .onEnd(function(materialNodeData) {
        jsonBuilder.appendMaterialNodeData(json, materialNodeData);
        collectUpdatedJson(json);
      });
  };

  var _writeExportFile = function(updatedJson, file, done) {
    var folders = file.split("/");
    folders.shift();
    var createExportDirProgress = progressHandler.createSequence();
    var exportFolder = folders.reduce(function(exportFolder, originalFolder) {
      createExportDirProgress.add(function(empty, _done) {
        fs.readdir(exportFolder, function(err, files) {
          var nextDir = exportFolder + "/" + originalFolder;
          if (~(files || []).indexOf(nextDir) || /\.json$/i.test(originalFolder)) {
            _done();
            return;
          }
          fs.mkdir(nextDir, _done);
        });
      });
      return exportFolder + "/" + originalFolder;
    }, EXPORT_PATH);
    createExportDirProgress.onEnd(function() {
      fs.writeFile(exportFolder, JSON.stringify(updatedJson), done);
    });
  };

  var _readDirectoryFileInfo = function(directory, collectFileInfo) {
    progressHandler.createSequence().add(function(empty, collectFiles) {
      fs.readdir(directory, function(err, files) { collectFiles(files); });
    }).add(function(files, _collectFileInfo) {
      var fileInfo = {
        directories: [],
        files: []
      };
      if (!files || !files.length) {
        _collectFileInfo(fileInfo);
        return;
      }
      var tracker = progressHandler.createTracker();
      files.forEach(function(file) {
        tracker.add(function(_fileInfo, done) {
          fs.stat(directory + "/" + file, function(err, stat) {
            var targetList = stat && stat.isDirectory() ? fileInfo.directories : fileInfo.files;
            targetList.push(directory + "/" + file);
            done(fileInfo);
          });
        });
      });
      tracker.onEnd(_collectFileInfo);
    }).onEnd(collectFileInfo);
  };

  var _loopDirectory = function(directory, collectFileList) {
    var fileList = [];
    var readDirectory = function(_directory, done) {
      var tracker = progressHandler.createTracker();
      _readDirectoryFileInfo(_directory, function(fileInfo) {
        fileList = fileList.concat(fileInfo.files);
        fileInfo.directories.length || tracker.forceEnd();
        fileInfo.directories.forEach(function(subdirectory) {
          tracker.add(function(value, _done) {
            readDirectory(subdirectory, _done);
          });
        });
      });
      tracker.onEnd(done);
    };
    readDirectory(directory, function() {
      readDirectory = null;
      collectFileList(fileList);
    });
  };

  var _extractFileTypes = function(fileList, type) {
    return fileList.reduce(function(typeList, file) {
      if (new RegExp(type).test(file)) typeList.push(file);
      return typeList;
    }, []);
  };

  module.exports.FILE_DATA_TYPES = FILE_DATA_TYPES;
  module.exports.getJSONs = getJSONs;
  module.exports.getResourceList = getResourceList;
  module.exports.generateResourceFile = generateResourceFile;
  module.exports.updateCurrentlyLoadedFile = updateCurrentlyLoadedFile;
  module.exports.getCurrentlyLoadedFile = getCurrentlyLoadedFile;
  module.exports.getCurrentlyLoadedFileData = getCurrentlyLoadedFileData;
  module.exports.getFileData = getFileData;
  module.exports.updateCurrentlyLoadedFileData = updateCurrentlyLoadedFileData;
  module.exports.updateFileData = updateFileData;
  module.exports.deleteEntriesFromCurrentlyLoadedFileData = deleteEntriesFromCurrentlyLoadedFileData;
  module.exports.deleteEntriesFromFileData = deleteEntriesFromFileData;
  module.exports.exportCurrentlyLoadedFile = exportCurrentlyLoadedFile;
  module.exports.exportFile = exportFile;

})();