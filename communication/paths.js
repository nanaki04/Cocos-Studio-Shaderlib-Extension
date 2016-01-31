(function() {
  var paths = {
    editor: "/editor",
    projects: "/editor/projects",
    files: "/editor/files",
    simulator: "/simulator"
  };

  if (module) {
    module.exports.list = paths;
  } else {
    ccssl.paths = paths;
  }
})();
