ccssl.UniformControlGenerator = ccssl.Class.define({
  init: function() {
    return this;
  },

  generateControls: function(shaderName, collectControls) {
    ccssl.communicator.post(ccssl.paths.shaders, {shaderName: shaderName}, function(uniforms) {
      var keys = Object.keys(uniforms || {});
      collectControls(keys.map(function(uniformName) {
        var uniformDefinition = uniforms[uniformName];
        return new ccssl.UniformControl().init(uniformName, uniformDefinition);
      }));
    });
  }
});
