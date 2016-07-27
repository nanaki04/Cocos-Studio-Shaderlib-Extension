(function() {
  var progressHandler = require('../utility/progressHandler');
  var jsonParser = require('./jsonParser');
  var nodeDefinitions = require('../enums/nodeDefinitions');

  var appendMaterialData = function(json, materialData) {
    var base = jsonParser.getBase(json);
    base["Materials"] = materialData;

    return json;
  };

  var appendLightSources = function(json, lightSourceData) {
    var base = jsonParser.getBase(json);
    base["LightSources"] = lightSourceData;

    return json;
  };

  module.exports.appendMaterialData = appendMaterialData;
  module.exports.appendLightSources = appendLightSources;

})();
