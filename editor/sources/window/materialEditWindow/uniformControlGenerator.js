ccssl.UniformControlGenerator = ccssl.Class.define({
  init: function() {
    this._scripts = [];

    return this;
  },

  generateControls: function(shaderName) {

  },

  _initScriptTag: function(shaderName) {
    if (this._scripts[shaderName]) {
      return;
    }
    this._scripts[shaderName] = document.createElement("script");
  }
});
