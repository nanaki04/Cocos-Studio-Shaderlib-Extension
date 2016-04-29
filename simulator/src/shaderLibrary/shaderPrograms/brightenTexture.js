ccsl.BrightenTexture = ccsl.ShaderProgram.extend({
  PATHS: {
    FRAGMENT_SHADER_SOURCE: "res/brightenTexture.fsh"
  },

  ATTRIBUTES: [

  ],

  DEPENDENT_SHADER: "DefaultTexture",

  initialize: function(callback) {
    this.inherit(callback);
  }
});