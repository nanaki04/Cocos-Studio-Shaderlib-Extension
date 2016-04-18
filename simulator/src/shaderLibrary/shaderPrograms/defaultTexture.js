ccsl.DefaultTexture = ccsl.ShaderProgram.extend({
  PATHS: {
    VERTEX_SHADER_SOURCE: "res/defaultTexture.vsh",
    FRAGMENT_SHADER_SOURCE: "res/defaultTexture.fsh"
  },

  ATTRIBUTES: [
    [cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS]
  ],

  DEPENDENT_SHADER: "DefaultColor",

  initialize: function(callback) {
    this.inherit(callback);
  }
});