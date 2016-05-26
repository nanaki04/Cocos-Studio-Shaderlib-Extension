(function() {
  var paths = {
    editor: "/editor",
    projects: "/editor/projects",
    files: "/editor/files",
    nodes: "/editor/nodes",
    simulator: "/simulator",
    action: "/editor/action",
    shaders: "/editor/shaders"
  };

  if (module) {
    module.exports.list = paths;
  } else {
    ccssl.paths = paths;
  }
})();
