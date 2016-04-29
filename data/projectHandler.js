(function() {
  var fs = require('fs');
  var fileHandler = require("./fileHandler");
  var progressHandler = require('../utility/progressHandler');
  var PROJECT_DATA_FILE = "data/projectData.json";
  var PROJECT_RESOURCES_FILE = "data/projectResourceList.json";
  var PROJECT_SPECIFIC_DATA_FOLDER = "data/projectData";

  var getCurrentProject = function(collectResult) {
    fs.readFile(PROJECT_DATA_FILE, function(err, data) {
      collectResult(JSON.parse(data).currentProject);
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
    fs.writeFile(PROJECT_RESOURCES_FILE, JSON.stringify({
      res: resourceList
    }), done);
  };

  var _handleProjectData = function(project, projectData, done) {
    progressHandler.createTracker(projectData)
      .add(_writeProjectData.bind(null, project))
      .onEnd(done);
  };

  var _readProjectData = function(project, done, sequenceHandler) {
    fs.readFile(PROJECT_DATA_FILE, function(err, data) {
      var projectData = JSON.parse(data);
      if (projectData.currentProject === project) {
        sequenceHandler.forceEnd();
        return;
      }
      done(projectData);
    });
  };

  var _writeProjectData = function(project, projectData, done) {
    projectData.currentProject = project;
    fs.writeFile(PROJECT_DATA_FILE, JSON.stringify(projectData), done);
  };

  var updateProjectSpecificData = function(project, newProjectSpecificData, done) {
    console.log("updateProjectSpecificData: " + newProjectSpecificData);
    progressHandler.createSequence(project)
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

  var _getProjectSpecificDataFile = function(project, collectProjectSpecificFile) {
    console.log("_getProjectSpecificDataFile: " + project);
    fs.readdir(PROJECT_SPECIFIC_DATA_FOLDER, function(err, files) {
      if (files.some(function(file) {
        return file === project + ".json";
      })) {
        collectProjectSpecificFile(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project + ".json");
        return;
      }
      console.log("initializing project specific data file: " + project + ".json");

      _initProjectSpecificDataFile(project, function() {
        collectProjectSpecificFile(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project + ".json");
      });
    });
  };

  var _initProjectSpecificDataFile = function(project, done) {
    fs.writeFile(PROJECT_SPECIFIC_DATA_FOLDER + "/" + project + ".json", JSON.stringify({
      name: project
    }), done);
  };

  var _readProjectSpecificData = function(projectSpecificDataFile, collectSpecificDataFileData) {
    fs.readFile(projectSpecificDataFile, function(err, projectSpecificFileData) {
      collectSpecificDataFileData(JSON.parse(projectSpecificFileData));
    })
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
        console.log("_writeProjectSpecificData: " + JSON.stringify(updatedData));

        fs.writeFile(projectSpecificFile, JSON.stringify(updatedData), _done);
      })
      .onEnd(done);
  };

  var _readResourceFolder = function(value, collectResourceList) {
    getCurrentProject(function(project) {
      console.log("project");
      console.log(project);
      fileHandler.getResourceList("projects/" + project, collectResourceList);
    });
  };

  module.exports.getCurrentProject = getCurrentProject;
  module.exports.getProjects = getProjects;
  module.exports.loadProject = loadProject;
  module.exports.writeResourceFileList = writeResourceFileList;
  module.exports.updateProjectSpecificData = updateProjectSpecificData;
  module.exports.getProjectSpecificData = getProjectSpecificData;

})();
