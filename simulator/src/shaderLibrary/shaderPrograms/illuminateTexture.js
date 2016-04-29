ccsl.IlluminateTexture = ccsl.ShaderProgram.extend({
  PATHS: {
    VERTEX_SHADER_SOURCE: "res/illuminateTextureMaxLightSourceCount1.vsh",
    FRAGMENT_SHADER_SOURCE: "res/illuminateTextureMaxLightSourceCount1.fsh"
  },

  ATTRIBUTES: [

  ],

  UNIFORMS: {
    "u_light_01_radius":    {type: "1f", value: 0.5},
    "u_light_01_scale_y":   {type: "1f", value: 1.0},
    "u_light_01_intensity": {type: "1f", value: 1.5},
    "u_light_01_offset":    {type: "2f", value: [1.0, 1.0]},
    "u_light_01_color":     {type: "4f", value: [1.0, 1.0, 0.6, 1.0]}
  },

  DEPENDENT_SHADER: "DefaultTexture",

  initialize: function(callback) {
    this._time = 0;
    this.scheduleUpdate();
    this.inherit(callback);
  },

  update: function(dt) {
    this._time += dt;
    //this.setCustomUniformValue("u_light_01_intensity", (Math.sin(this._time)) / 2);




    var p = this.getParent();

    var lightOffset = [
      (Math.cos(this._time) + 1) / 2 * p.width,
      (Math.sin(this._time) + 1) / 2 * -p.height
    ];
    //var lightOffset = [0, -200];

    var zeroToCenter = [p.width * p.anchorX, p.height * p.anchorY];
    lightOffset[0] -= zeroToCenter[0];
    lightOffset[1] -= zeroToCenter[1];
    var Xmodifier = (p.rotationX > 0 && lightOffset[1] < 0) || (p.rotationX < 0 && lightOffset[1] > 0) ? -1 : 1;
    var Ymodifier = (p.rotationY > 0 && lightOffset[0] < 0) || (p.rotationY < 0 && lightOffset[0] > 0) ? 1 : -1;

    lightOffset = [
      lightOffset[0] + Xmodifier * Math.sin((p.rotationX * Math.PI) / 180) * lightOffset[1] / Math.sin(((90) * Math.PI) / 180),
      lightOffset[1] + Ymodifier * Math.sin((p.rotationY * Math.PI) / 180) * lightOffset[0] / Math.sin(((90) * Math.PI) / 180)
    ];

    lightOffset[0] += zeroToCenter[0];
    lightOffset[1] += zeroToCenter[1];

    lightOffset[0] /= p.width;
    lightOffset[1] /= -p.height;

    p._lightOffset = lightOffset;

    //x


    //var phi = (90 * Math.PI) / 180;
    //var XrotationMat = [
    //  [1, 0, 0, 0],
    //  [Math.sin(phi), Math.cos(phi), 0, 0],
    //  [0, 0, 1, 0],
    //  [0, 0, 0, 1]
    //];
    //
    //var multiplyMatWithVector = function(mat, v) {
    //  return [
    //    mat[0][0] * v[0] + mat[0][1] * v[1] + mat[0][2] * v[2] + mat[0][3] * v[3],
    //    mat[1][0] * v[0] + mat[1][1] * v[1] + mat[1][2] * v[2] + mat[1][3] * v[3],
    //    mat[2][0] * v[0] + mat[2][1] * v[1] + mat[2][2] * v[2] + mat[2][3] * v[3],
    //    mat[3][0] * v[0] + mat[3][1] * v[1] + mat[3][2] * v[2] + mat[3][3] * v[3]
    //  ]
    //};
    //
    //var getIdentityMatrix = function() {
    //  return [
    //    1, 0, 0, 0,
    //    0, 1, 0, 0,
    //    0, 0, 1, 0,
    //    0, 0, 0, 1
    //  ]
    //};
    //lightOffset[0] -= p.anchorX;
    //lightOffset[1] -= (1 - p.anchorY);

    //var rotationVectorX = cc.p(-Math.sin((-p.rotationX * Math.PI) / 180), Math.sin(((180 + p.rotationX) * Math.PI) / 180));
    //var rotationVectorY = cc.p(Math.sin(((180 + p.rotationY) * Math.PI) / 180), Math.sin((-p.rotationY * Math.PI) / 180));
    //var wx = lightOffset[0] * rotationVectorX.x + lightOffset[1] * rotationVectorX.y;
    //var wy = lightOffset[0] * rotationVectorY.x + lightOffset[1] * rotationVectorY.y;
    //var rotatedLightOffset = [
    //  rotationVectorX.x * lightOffset[0] + rotationVectorX.y * lightOffset[1],
    //  rotationVectorY.x * lightOffset[0] + rotationVectorY.y * lightOffset[1]
    //];
    //var p = this.getParent();
    //lightOffset.x *= p.scaleX;
    //lightOffset.y *= p.scaleY;
    //var zeroPointToCenter = cc.p(p.width * p.anchorX, p.height * p.anchorY);
    //var zeroPointDisplacement =
    this.setCustomUniformValue("u_light_01_offset", lightOffset);
    this.updateUniforms();
  }
});