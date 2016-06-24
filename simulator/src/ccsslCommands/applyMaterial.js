ccssl.ApplyMaterial = cc.Class.extend({
  init: function(commandData) {
    this._nodeIdentifiers = commandData.selection;
    this._shaderName = commandData.material.shader;
  },

  run: function() {
    this._applyShadersToNodes();
  },

  _getNodes: function() {
    var rootWidget = cc.director.getRunningScene().getLoadedResourceNode();
    return this._nodeIdentifiers.map(function(identifier) {
      return ccui.helper.seekWidgetByTag(rootWidget, identifier)
        || ccui.helper.seekActionWidgetByActionTag(rootWidget, identifier)
        || ccui.helper.seekWidgetByName(rootWidget, identifier);
    });
  },

  _createShader: function(done) {
    new ccsl.ShaderFileClassDictionary[this._shaderName]()
      .initialize(done);
  },

  _applyShadersToNodes: function() {
    this._getNodes().forEach(function(node) {
      if (!node) {
        console.warn("node not found");
        return;
      }

      if (!node._protectedChildren || !node._protectedChildren.length) {
        this._applyShaderToNode(node);
        return;
      }

      node._protectedChildren.forEach(this._applyShaderToNode.bind(this));
    }.bind(this));
  },

  _applyShaderToNode: function(node) {
    this._createShader(function(shader) {
      node.addChild(shader);
    });
  }
});
