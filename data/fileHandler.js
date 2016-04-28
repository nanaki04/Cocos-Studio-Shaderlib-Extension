(function() {
  var fs = require('fs');
  var progressHandler = require('../utility/progressHandler');
  var projectHandler = require('./projectHandler');
  var jsonParser = require('./jsonParser');
  var paths = require('../communication/paths');

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
    console.log("updating currently loaded file");
    progressHandler.createSequence()
      .add(function(empty, collectProject) {
        projectHandler.getCurrentProject(collectProject);
      })
      .add(function(project, _done) {
        console.log("updating project specific data");
        projectHandler.updateProjectSpecificData(project, {
          currentlyLoadedFile: file
        }, _done);
      })
      .onEnd(done);
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

  module.exports.getJSONs = getJSONs;
  module.exports.getResourceList = getResourceList;
  module.exports.generateResourceFile = generateResourceFile;
  module.exports.updateCurrentlyLoadedFile = updateCurrentlyLoadedFile;
  module.exports.getCurrentlyLoadedFile = getCurrentlyLoadedFile;

})();