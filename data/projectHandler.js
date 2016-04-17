(function() {
  var fs = require('fs');
  var fileHandler = require("./fileHandler");
  var progressHandler = require('../utility/progressHandler');
  var PROJECT_DATA_FILE = "data/projectData.json";
  var PROJECT_RESOURCES_FILE = "data/projectResourceList.json";

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
      //.add(_createResourceFileList)
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

  //var _createResourceFileList = function(value, done) {
  //  progressHandler.createSequence()
  //    .add(_readResourceFolder)
  //    .add(writeResourceFileList)
  //    .onEnd(done);
  //};

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

})();
