(function() {
  var progressHandler = require('../utility/progressHandler');
  var fs = require('fs');

  var SHADER_PROGRAM_ROOT = "simulator/src/shaderLibrary/shaderPrograms";

  var getShaderList = function(collectShaderList) {
    fs.readdir(SHADER_PROGRAM_ROOT, function(err, files) {
      console.log(err);
      collectShaderList(files);
    });
  };

  module.exports.getShaderList = getShaderList;

})();
