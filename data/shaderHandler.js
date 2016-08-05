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

  var getUniforms = function(shaderName) {
    var uniformData = {};
    var filePath = SHADER_PROGRAM_ROOT + "/" + shaderName;
  };

  var _addUniformDataFromFile = function(uniformData, filePath, done) {
    fs.readFile(filePath, function(err, shaderScript) {
      _parseShaderScript(shaderScript);
    });
  };

  var _parseShaderScript = function(shaderScript) {

  };

  module.exports.getShaderList = getShaderList;
  module.exports.getUniforms = getUniforms;

})();
