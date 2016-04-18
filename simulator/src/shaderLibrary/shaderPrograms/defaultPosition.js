ccsl.DefaultPosition = ccsl.ShaderProgram.extend({
  PATHS: {
    VERTEX_SHADER_SOURCE: "res/defaultPosition.vsh",
    FRAGMENT_SHADER_SOURCE: "res/defaultPosition.fsh"
  },

  ATTRIBUTES: [
    [cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION]
  ],

  initialize: function(callback) {
    ccsl.ShaderProgram.prototype.initialize.call(this, this.PATHS.VERTEX_SHADER_SOURCE, this.PATHS.FRAGMENT_SHADER_SOURCE, this.ATTRIBUTES, callback);
  }
});