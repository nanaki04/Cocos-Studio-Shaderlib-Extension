(function() {
  var fs = require('fs');
  var projectHandler = require('./projectHandler');

  var _extractDirectoriesAndJsonFiles = function(files, root, directoryInfo) {
    return files.reduce(function(fileInfo, file) {
      if (/.json$/.test(file))                          fileInfo.jsonList.push(root + "/" + file.replace(/.json$/, ""));
      if (fs.statSync(root + "/" + file).isDirectory()) fileInfo.directories.push(file);

      return fileInfo;
    }, directoryInfo);
  };

  var _loopProjectDirectory = function(root, directoryInfo, callback) {
    fs.readdir(root, function(err, files) {
      _extractDirectoriesAndJsonFiles(files, root, directoryInfo);
      if (directoryInfo.directories.length === 0) {
        callback();
        return;
      }

      var jsonLists = [];
      var directories = directoryInfo.directories;
      directoryInfo.directories.reduce(function(status, directory, index) {
        jsonLists[index] = {
          directories: [],
          jsonList: []
        };
        status[directory] = false;
        _loopProjectDirectory(root + "/" + directory, jsonLists[index], function() {
          status[directory] = true;
          if (directories.reduce(function(ready, _directory) {
            if (!status[_directory]) return false;
            return ready;
          }, true)) {
            delete directoryInfo.directories;
            jsonLists.forEach(function(jsonList) {
              directoryInfo.jsonList = directoryInfo.jsonList.concat(jsonList.jsonList);
            });
            callback();
          }
        });

        return status;
      }, {});
    });
  };

  module.exports.getFiles = function(collectData) {
    projectHandler.getCurrentProject(function(currentProject) {
      var directoryInfo = {
        directories: [],
        jsonList: []
      };
      _loopProjectDirectory("projects/" + currentProject, directoryInfo, function() {
        collectData(directoryInfo);
      });
    });
  };

})();