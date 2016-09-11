ccsl.BrightenTexture = ccsl.ShaderProgram.extend({
  PATHS: {
    FRAGMENT_SHADER_SOURCE: "res/brightenTexture.fsh"
  },

  ATTRIBUTES: [

  ],

  UNIFORMS: {
    "u_intensity": {type: "1f", value: 1.5, min: 0, max: 2}
  },

  DEPENDENT_SHADER: "DefaultTexture",

  initialize: function(callback) {
    this.inherit(callback);
  }
});