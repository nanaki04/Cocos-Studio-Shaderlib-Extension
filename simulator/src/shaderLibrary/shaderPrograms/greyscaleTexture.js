ccsl.GreyscaleTexture = ccsl.ShaderProgram.extend({
  PATHS: {
    FRAGMENT_SHADER_SOURCE: "res/greyscaleTexture.fsh"
  },

  ATTRIBUTES: [

  ],

  DEPENDENT_SHADER: "DefaultTexture",

  initialize: function(callback) {
    this.inherit(callback);
  }
});