ccsl.ShaderTestScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    this._mainLayer = new ccsl.MainLayer();
    this.addChild(this._mainLayer);
  }
});
