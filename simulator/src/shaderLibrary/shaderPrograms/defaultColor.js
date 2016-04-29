ccsl.DefaultColor = ccsl.ShaderProgram.extend({
  PATHS: {
    VERTEX_SHADER_SOURCE: "res/defaultColor.vsh",
    FRAGMENT_SHADER_SOURCE: "res/defaultColor.fsh"
  },

  ATTRIBUTES: [
    [cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR]
  ],

  DEPENDENT_SHADER: "DefaultPosition",

  initialize: function(callback) {
    this.inherit(callback);
  }
});