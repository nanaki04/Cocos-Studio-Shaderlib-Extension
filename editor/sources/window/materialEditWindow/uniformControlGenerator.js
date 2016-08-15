ccssl.UniformControlGenerator = ccssl.Class.define({
  init: function() {
    this._scripts = [];

    return this;
  },

  generateControls: function(shaderName, collectControls) {
    ccssl.communicator.post(ccssl.paths.shaders, {shaderName: shaderName}, function() {
      collectControls([]);
    });
  },

  _initScriptTag: function(shaderName) {
    if (this._scripts[shaderName]) {
      return;
    }
    this._scripts[shaderName] = document.createElement("script");
  }
});
