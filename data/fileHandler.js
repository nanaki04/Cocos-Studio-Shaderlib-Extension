(function() {
  var fs = require('fs');
  var progressHandler = require('../utility/progressHandler');
  var projectHandler = require('./projectHandler');
  var jsonParser = require('./jsonParser');
  var paths = require('../communication/paths');

  var FILE_DATA_TYPES = {
    HISTORY: "_HISTORY",
    SELECTION: "_SELECTION",
    MATERIALS: "_MATERIALS"
  };

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

  var _getCurrentlyLoadedFileDataPath = function(type, collectCurrentlyLoadedFileData) {
    var tracker = progressHandler.createTracker({})
      .add(function(fileData, done) {
        projectHandler.getProjectSpecificDataFolder(function(projectSpecificDataFolder) {
          fileData.projectSpecificDataFolder = projectSpecificDataFolder;
          done(fileData);
        });
      })
      .add(function(fileData, done) {
        getCurrentlyLoadedFile(function(currentlyLoadedFile) {
          fileData.currentlyLoadedFile = currentlyLoadedFile;
          done(fileData);
        });
      });

    progressHandler.createSequence()
      .add(function(empty, collectFileData) {
        tracker.onEnd(collectFileData);
      })
      .add(function(fileData, collectFileName) {
        fs.readdir(fileData.projectSpecificDataFolder, function(err, files) {
          var fileName = (fileData.currentlyLoadedFile.replace(/\.json/gi, "") + type + ".json").replace(/\//g, "_");
          var filePath = fileData.projectSpecificDataFolder + "/" + fileName;

          if (files.some(function(file) {
              return file === fileName;
            })) {
            collectFileName(filePath);
            return;
          }

          fs.writeFile(filePath, JSON.stringify({}), function() {
            collectFileName(filePath);
          });
        });
      })
      .onEnd(collectCurrentlyLoadedFileData);
  };

  var getCurrentlyLoadedFileData = function(type, collectCurrentlyLoadedFileData) {
    _getCurrentlyLoadedFileDataPath(type, function(fileDataPath) {
      console.log("FILE DATA PATH");
      console.log(fileDataPath);
      fs.readFile(fileDataPath, function(err, data) {
        console.log("getCurrentlyLoadedFileData");
        console.log(err);
        console.log(JSON.parse(data));
        collectCurrentlyLoadedFileData(JSON.parse(data), fileDataPath);
      });
    });
  };

  var updateCurrentlyLoadedFileData = function(type, data, done) {
    progressHandler.createSequence({})
      .add(function(result, collectCurrentlyLoadedFileData) {
        getCurrentlyLoadedFileData(type, function(fileData, fileDataPath) {
          result.originalData = fileData;
          result.fileDataPath = fileDataPath;
          collectCurrentlyLoadedFileData(result);
        });
      })
      .onEnd(function(result) {
        var keys = Object.keys(data);
        var updatedData = keys.reduce(function(_updatedData, key) {
          _updatedData[key] = data[key];
          return _updatedData;
        }, result.originalData);

        result.updatedData = updatedData;

        fs.writeFile(result.fileDataPath, JSON.stringify(updatedData), function() {
          done(result);
        });
      });
  };

  var deleteEntriesFromCurrentlyLoadedFileData = function(type, entries, done) {
    progressHandler.createSequence({})
      .add(function(result, collectCurrentlyLoadedFileData) {
        getCurrentlyLoadedFileData(type, function(fileData, fileDataPath) {
          result.originalData = fileData;
          result.fileDataPath = fileDataPath;
          collectCurrentlyLoadedFileData(result);
        });
      })
      .onEnd(function(result) {
        var updatedData = entries.reduce(function(_updatedData, key) {
          delete _updatedData[key];
          return _updatedData;
        }, result.originalData);

        result.updatedData = updatedData;

        fs.writeFile(result.fileDataPath, JSON.stringify(updatedData), function() {
          done(result);
        });
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
  module.exports.updateCurrentlyLoadedFileData = updateCurrentlyLoadedFileData;
  module.exports.deleteEntriesFromCurrentlyLoadedFileData = deleteEntriesFromCurrentlyLoadedFileData;

})();