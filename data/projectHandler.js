(function() {
  var fs = require('fs');
  var PROJECT_DATA_FILE = "data/projectData.json";

  module.exports.getProjects = function(collectData) {
    fs.readdir("projects", function(err, files) {
      var projects = files.reduce(function(_projects, file) {
        if (fs.statSync("projects/" + file).isDirectory()) _projects.push(file);
        return _projects;
      }, []);
      collectData(err, {"projects": projects});
    });
  };

  module.exports.loadProject = function(project, collectResult) {
    fs.readFile(PROJECT_DATA_FILE, function(err, data) {
      var projectData = JSON.parse(data);
      if (projectData.currentProject === project) {
        collectResult(true);
      }
      projectData.currentProject = project;
      fs.writeFile(PROJECT_DATA_FILE, JSON.stringify(projectData), function(err) {
        collectResult(true);
      });
    });
  };

  module.exports.getCurrentProject = function(collectResult) {
    fs.readFile(PROJECT_DATA_FILE, function(err, data) {
      collectResult(JSON.parse(data).currentProject);
    });
  }
})();
