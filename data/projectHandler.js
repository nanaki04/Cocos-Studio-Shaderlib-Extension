(function() {
  var fs = require('fs');
  var fileHandler = require("./fileHandler");
  var progressHandler = require('../utility/progressHandler');
  var PROJECT_DATA_FILE = "data/projectData.json";
  var PROJECT_RESOURCES_FILE = "data/projectResourceList.json";
  var PROJECT_SPECIFIC_DATA_FOLDER = "data/projectData";
  var queue = require('../utility/queue');

  var fileAccessQueues = {
    PROJECT_DATA_FILE: new queue.Queue(),
    PROJECT_RESOURCE_FILE: new queue.Queue()
  };

  var getCurrentProject = function(collectResult) {
    fileAccessQueues.PROJECT_DATA_FILE.enqueue(function(empty, unlockFileAccess) {
      fs.readFile(PROJECT_DATA_FILE, function(err, data) {
        unlockFileAccess();
        collectResult(JSON.parse(data).currentProject);
      });
    });
  };

  var getProjects = function(collectProjectList) {
    fs.readdir("projects", function(err, files) {
      var projects = files.reduce(function(_projects, file) {
        if (fs.statSync("projects/" + file).isDirectory()) _projects.push(file);
        return _projects;
      }, []);
      collectProjectList(err, {"projects": projects});
    });
  };

  var loadProject = function(project, collectResult) {
    progressHandler.createSequence(project)
      .add(_readProjectData)
      .add(_handleProjectData.bind(null, project))
      .onEnd(collectResult);
  };

  var writeResourceFileList = function(resourceList, done) {
    fileAccessQueues.PROJECT_RESOURCE_FILE.enqueue(function(empty, unlockFileAccess) {
      fs.writeFile(PROJECT_RESOURCES_FILE, JSON.stringify({
        res: resourceList
      }), function() {
        unlockFileAccess();
        done();
      });
    });
  };

  var _handleProjectData = function(project, projectData, done) {
    progressHandler.createTracker(projectData)
      .add(_writeProjectData.bind(null, project))
      .onEnd(done);
  };

  var _readProjectData = function(project, done, sequenceHandler) {
    fileAccessQueues.PROJECT_DATA_FILE.enqueue(function(empty, unlockFileAccess) {
      fs.readFile(PROJECT_DATA_FILE, function(err, data) {
        unlockFileAccess();
        var projectData = JSON.parse(data);
        if (projectData.currentProject === project) {
          sequenceHandler.forceEnd();
          return;
        }
        done(projectData);
      });
    });
  };

  var _writeProjectData = function(project, projectData, done) {
    projectData.currentProject = project;
    fileAccessQueues.PROJECT_DATA_FILE.enqueue(function(empty, unlockFileAccess) {
      fs.writeFile(PROJECT_DATA_FILE, JSON.stringify(projectData), function() {
        unlockFileAccess();
        done();
      });
    });
  };

  var updateProjectSpecificData = function(newProjectSpecificData, done) {
    progressHandler.createSequence()
      .add(function(empty, collectProject) {
        getCurrentProject(collectProject);
      })
      .add(_getProjectSpecificDataFile)
      .add(_writeProjectSpecificData.bind(null, newProjectSpecificData))
      .onEnd(done);
  };

  var getProjectSpecificData = function(collectProjectSpecificData) {
    progressHandler.createSequence()
      .add(function(empty, collectProject) {
        getCurrentProject(collectProject);
      })
      .add(_getProjectSpecificDataFile)
      .add(_readProjectSpecificData)
      .onEnd(collectProjectSpecificData);
  };

  var getProjectSpecificDataFolder = function(collectProjectSpecificDataFolder) {
    getCurrentProject(function(project) {
      _getProjectSpecificDataFolder(project, collectProjectSpecificDataFolder);
    });
  };

  var _getProjectSpecificDataFolder = function(project, collectProjectSpecificDataFolder) {
    fs.readdir(PROJECT_SPECIFIC_DATA_FOLDER, function(err, files) {
      if (files.some(function(file) {
          return file === project;
        })) {
        collectProjectSpecificDataFolder(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project);
        return;
      }

      fs.mkdir(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project, function() {
        collectProjectSpecificDataFolder(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project);
      });
    });
  };

  var _getProjectSpecificDataFile = function(project, collectProjectSpecificFile) {
    var sequence = progressHandler.createSequence(project);

    sequence.add(function(_project, collectProjectSpecificDataFolder) {
      _getProjectSpecificDataFolder(_project, collectProjectSpecificDataFolder);
    });

    sequence.add(function(projectSpecificDataFolder, done) {
      fs.readdir(projectSpecificDataFolder, function(err, files) {
        if (files.some(function(file) {
            return file === project + ".json";
          })) {
          console.log("projectSpecificDataFile: " + projectSpecificDataFolder + "/" + project + ".json");
          done(projectSpecificDataFolder + "/" + project + ".json");
          return;
        }

        _initProjectSpecificDataFile(project, function() {
          done(projectSpecificDataFolder + "/" + project + ".json");
        });
      })
    });

    sequence.onEnd(collectProjectSpecificFile);
  };

  var _initProjectSpecificDataFile = function(project, done) {
    fs.writeFile(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project + "/" + project + ".json", JSON.stringify({
      name: project
    }), done);
  };

  var _readProjectSpecificData = function(projectSpecificDataFile, collectSpecificDataFileData) {
    _getDynamicFileQueue(projectSpecificDataFile).enqueue(function(empty, unlockFileAccess) {
      fs.readFile(projectSpecificDataFile, function(err, projectSpecificFileData) {
        unlockFileAccess();
        collectSpecificDataFileData(JSON.parse(projectSpecificFileData));
      });
    });
  };

  var _writeProjectSpecificData = function(projectSpecificData, projectSpecificFile, done) {
    progressHandler.createSequence(projectSpecificFile)
      .add(_readProjectSpecificData)
      .add(function(oldProjectSpecificData, _done) {
        var keys = Object.keys(projectSpecificData);
        var updatedData = keys.reduce(function(_updatedData, key) {
          _updatedData[key] = projectSpecificData[key];
          return _updatedData;
        }, oldProjectSpecificData);

        _getDynamicFileQueue(projectSpecificFile).enqueue(function(empty, unlockFileAccess) {
          fs.writeFile(projectSpecificFile, JSON.stringify(updatedData), function() {
            unlockFileAccess();
            _done();
          });
        });
      })
      .onEnd(done);
  };

  var _readResourceFolder = function(value, collectResourceList) {
    getCurrentProject(function(project) {
      fileHandler.getResourceList("projects/" + project, collectResourceList);
    });
  };

  var _getDynamicFileQueue = function(file) {
    if (fileAccessQueues[file] == null) {
      fileAccessQueues[file] = new queue.Queue();
    }
    return fileAccessQueues[file];
  };

  module.exports.getCurrentProject = getCurrentProject;
  module.exports.getProjects = getProjects;
  module.exports.loadProject = loadProject;
  module.exports.writeResourceFileList = writeResourceFileList;
  module.exports.updateProjectSpecificData = updateProjectSpecificData;
  module.exports.getProjectSpecificData = getProjectSpecificData;
  module.exports.getProjectSpecificDataFolder = getProjectSpecificDataFolder;

})();
