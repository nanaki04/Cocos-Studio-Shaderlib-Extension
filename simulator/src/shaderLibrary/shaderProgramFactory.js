ccsl.ShaderProgramFactory = {
  DEFAULT_SPRITE_SHADER_ATTRIBUTES: [
    [cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION],
    [cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR],
    [cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS]
  ],

  CUSTOM_PARAMETER_TYPE_ALIASES: {
    "1i": [ "int", "integer", "i", "int32" ],
    "1f": [ "float", "f" ],
    "2f": [ "v2", "vec2", "vector2", "p2d", "2dPoint" ],
    "3f": [ "v3", "vec3", "vector3", "p3d", "3dPoint" ],
    "4f": [ "v4", "vec4", "vector4", "c", "col", "color" ]
  },

  addShaderAttributes: function(shader, attributes) {
    var _shader = shader || new cc.GLProgram();
    var _attributes = attributes || this.DEFAULT_SPRITE_SHADER_ATTRIBUTES;

    _attributes.forEach(function(attributePair) {
      _shader.addAttribute.apply(_shader, attributePair);
    });

    return _shader;
  },

  createShaderProgram: function(shaderFiles, attributes) {
    var shader = new cc.GLProgram(shaderFiles.vsh, shaderFiles.fsh);
    this.addShaderAttributes(shader);
    attributes && this.addShaderAttributes(shader, attributes);
    shader.link();
    shader.updateUniforms();

    return shader;
  },

  /**
   * @method addCustomShaderParameters
   * @param parameters
   * @example [
   *   { type: "f", name: "u_intensity", value: 1.0 },
   *   { type: "v2", name: "u_position", value: [1.0, 0.5] },
   *   { type: "i", name: "CC_Texture1", value: 1 }
   * ]
   */
  addCustomShaderParameters: function(parameters) {

  }
};