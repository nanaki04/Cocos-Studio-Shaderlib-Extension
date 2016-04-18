ccsl.ShaderEffect = cc.Class.extend({
  ctor: function () {
    this._shaderName = "";
    this._uniformValues = {};
    this._activeShaderPrograms = [];
  },

  setShaderName: function (shaderName) {
    this._shaderName = shaderName;
  },

  updateUniformValues: function (uniformValues) {
    this._uniformValues = uniformValues;

    this._activeShaderPrograms.forEach(function(shaderProgram) {
      shaderProgram.setCustomUniformValues(uniformValues);
    });
  },

  instantiateShaderProgram: function() {
    if (!ccsl[this._shaderName]) {
      ccsl.debugger.warn("Shader program not found: " + this._shaderName);
      return null;
    }

    var shaderProgram = new ccsl[this._shaderName]().initialize();

    shaderProgram.addEventListenerOnce("onEnter", function(_shaderProgram) {
      _shaderProgram.setCustomUniformValues(this._uniformValues);
      this._activeShaderPrograms.push(_shaderProgram);
    }, this);

    shaderProgram.addEventListenerOnce("onExit", this.removeShaderProgram, this);

    return shaderProgram;
  },

  removeShaderProgram: function(shaderProgram) {
    var index = this._activeShaderPrograms.indexOf(shaderProgram);
    if (~index)
      this._activeShaderPrograms.splice(index, 1);
  }

});
