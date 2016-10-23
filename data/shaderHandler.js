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

  var getUniforms = function(shaderName, collectUniformData) {
    var filePath = SHADER_PROGRAM_ROOT + "/" + shaderName;
    _getUniformDataFromFile(filePath, collectUniformData);
  };

  var _getUniformDataFromFile = function(filePath, collectUniformData) {
    fs.readFile(filePath, "utf-8", function(err, shaderScript) {
      if (err) {
        collectUniformData("");
        return;
      }
      collectUniformData(_parseShaderScript(shaderScript));
    });
  };

  var _parseShaderScript = function(shaderScript) {
    return JSON.parse(_extractUniformString(shaderScript));
  };

  var _extractUniformString = function(shaderScript) {
    var split = shaderScript.split("UNIFORMS:");
    if (split.length < 2) {
      return "{}";
    }
    var uniformString = "";
    split = split[1].split("{");
    split.shift();
    var length = split.length;
    var depth = 0;

    for (var x = 0; x < length; x++) {
      depth++;
      var part = split[x];
      part = "{" + part;
      part = _convertKeysToJson(part);
      uniformString += part;
      depth -= (part.match(/}/g) || []).length;
      if (!depth) {
        uniformString = uniformString.substring(0, uniformString.search(/}([^}]*)$/) + 1);
        break;
      }
    }

    return uniformString;
  };

  var _convertKeysToJson = function(string) {
    var keys = string.match(/[^a-z_"][a-z_][a-z_\d]+[^a-z_"]/ig);
    if (keys == null) {
      return string;
    }
    var stringifiedKeys = keys.map(function(key) {
      var trimmedKey = key.match(/[a-z_][a-z_\d]+/ig);
      return key.replace(trimmedKey, '"' + trimmedKey + '"');
    });
    keys.forEach(function(key, index) {
      string = string.replace(key, stringifiedKeys[index]);
    });

    return string;
  };

  module.exports.getShaderList = getShaderList;
  module.exports.getUniforms = getUniforms;

})();
