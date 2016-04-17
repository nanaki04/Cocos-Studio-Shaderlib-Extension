ccsl.ShaderTestSprite = cc.Sprite.extend({
  ctor: function (texture) {
    this._super(texture || res.HelloWorld_png);
    this.setPosition(ccsl.Utility.getScreenCenter());

    //this.addEventListener("load", function() {
    this.setShaderProgram(
      ccsl.ShaderProgramFactory.createShaderProgram({
        vsh: "res/gray.vsh",
        fsh: "res/gray.fsh"
      })
    );
    //}.bind(this));
  }
});

