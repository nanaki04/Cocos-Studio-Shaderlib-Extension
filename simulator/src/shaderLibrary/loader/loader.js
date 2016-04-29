ccsl.load = (function() {
  var loadCcsObject = function(file) {
    return ccs.load(file);
  };

  var parseJson = function(file) {
    var json = cc.loader.getRes(file);

    if(!json) {
      ccsl.debugger.error("Failed to load ccs file, json not preloaded: ", file);
      return {};
    }
    return json;
  };

  var getShaderEffectsData = function(json) {
    var base = (json["Content"] && json["Content"]["Content"]) || json["widgetTree"] || json["nodeTree"] || json["gameobjects"];
    return base["shaderEffects"];
  };

  var getLightningSourcesData = function(json) {
    var base = (json["Content"] && json["Content"]["Content"]) || json["widgetTree"] || json["nodeTree"] || json["gameobjects"];
    return base["lightningSources"];
  };

  var parseShaderEffectsData = function(data) {
    return data.map(function(shaderEffectData) {
      var nodeMap = {};
      shaderEffectData.nodes.forEach(function(node) {
        nodeMap[node] = setUniformValues(
          instantiateShaderEffect(shaderEffectData.shaderProgram),
          shaderEffectData.uniformValues
        );
      });
      return nodeMap;
    });
  };

  var parseLightningSourcesData = function(data) {

  };

  var appendShaderEffects = function(ccsNode, shaderEffects) {
    shaderEffects.forEach(function(nodeMap) {
      var tags = Object.keys(nodeMap);
      tags.forEach(function(tag) {
        ccui.helper.seekWidgetByTag(ccsNode, tag).addChild(nodeMap[tag]);
      });
    });
  };

  var appendLightningSources = function(lightningSources) {

  };

  var instantiateShaderEffect = function(shaderName, uniformValues) {
    if (!ccsl[shaderName]) {
      return ccsl.debugger.warn("Shader program not found: " + shaderName);
    }

    return new ccsl[shaderName]();
  };

  var setUniformValues = function(shaderProgram, uniformValues) {
    if (!uniformValues) {
      return shaderProgram;
    }

    var keys = Object.keys(uniformValues);
    keys.forEach(function(key) {
      shaderProgram.setCustomUniformValue(key, uniformValues[key]);
    });

    shaderProgram.updateUniforms();

    return shaderProgram;
  };

  return function(file) {
    var ccsObject = loadCcsObject(file);
    var json = parseJson(file);

    appendShaderEffects(
      ccsObject.node,
      parseShaderEffectsData(
        getShaderEffectsData(json)
      )
    );

    return ccsObject;
  }
})();
