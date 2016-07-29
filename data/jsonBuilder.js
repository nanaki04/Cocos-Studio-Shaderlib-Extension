(function() {
  var progressHandler = require('../utility/progressHandler');
  var jsonParser = require('./jsonParser');
  var nodeDefinitions = require('../enums/nodeDefinitions');

  var appendMaterialData = function(json, materialData) {
    console.log("JSON BUILDER APPEND MATERIAL DATA");
    console.log(json);
    var base = jsonParser.getBase(json);
    base["Materials"] = materialData;

    return json;
  };

  var appendMaterialNodeData = function(json, materialNodeData) {
    console.log("JSON BUILDER APPEND MATERIAL NODE DATA");
    console.log(json);
    var base = jsonParser.getBase(json);
    var materials = base["Materials"];
    var keys = Object.keys(materialNodeData);
    keys.forEach(function(materialId) {
      if (materials[materialId] == null) {
        return;
      }
      materials[materialId]["nodes"] = materialNodeData[materialId];
    });

    return json;
  };

  var appendLightSources = function(json, lightSourceData) {
    var base = jsonParser.getBase(json);
    base["LightSources"] = lightSourceData;

    return json;
  };

  module.exports.appendMaterialData = appendMaterialData;
  module.exports.appendMaterialNodeData = appendMaterialNodeData;
  module.exports.appendLightSources = appendLightSources;

})();
