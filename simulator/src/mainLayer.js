ccsl.MainLayer = cc.Layer.extend({
  onEnter: function () {
    this.shaderTestSprite = new ccsl.ShaderTestSprite();
    this.addChild(this.shaderTestSprite);
  }
});

