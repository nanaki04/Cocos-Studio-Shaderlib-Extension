(function() {
  var paths = {
    editor: "/editor",
    projects: "/editor/projects",
    files: "/editor/files",
    nodes: "/editor/nodes",
    selection: "/editor/selection",
    simulator: "/simulator",
    action: "/editor/action",
    shaders: "/editor/shaders",
    materials: "/editor/materials",
    material_nodes: "/editor/material_nodes",
    animation: "/editor/animation",
    keyframes: "/editor/keyframes",
    export: "/export"
  };

  if (module) {
    module.exports.list = paths;
  } else {
    ccssl.paths = paths;
  }
})();
