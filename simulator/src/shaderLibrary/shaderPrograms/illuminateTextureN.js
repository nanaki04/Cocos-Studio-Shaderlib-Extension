ccsl.IlluminateTextureN = ccsl.ShaderProgram.extend({
  PATHS: {
    VERTEX_SHADER_SOURCE: "res/illuminateTextureMaxLightSourceCountN.vsh",
    FRAGMENT_SHADER_SOURCE: "res/illuminateTextureMaxLightSourceCountN.fsh"
  },

  ATTRIBUTES: [

  ],

  UNIFORMS: {
    "u_light_scale_y":    {type: "Matrix4fv", value: [[
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0
    ]]}
    //"u_light_01_scale_y":   {type: "1f", value: 1.0},
    //"u_light_01_intensity": {type: "1f", value: 0.5},
    //"u_light_01_offset":    {type: "2f", value: [1.0, 1.0]},
    //"u_light_01_color":     {type: "4f", value: [1.0, 1.0, 0.6, 1.0]}
  },

  DEPENDENT_SHADER: "DefaultTexture",

  initialize: function(callback) {
    this._time = 0;
    //this.scheduleUpdate();
    this.inherit(callback);
  }

  //update: function(dt) {
  //  this._time += dt;
  //  //this.setCustomUniformValue("u_light_01_intensity", (Math.sin(this._time)) / 2);
  //  this.setCustomUniformValue("u_light_01_offset", [
  //    (Math.cos(this._time) + 1) / 2,
  //    (Math.sin(this._time) + 1) / 2
  //  ]);
  //  this.updateUniforms();
  //}
});