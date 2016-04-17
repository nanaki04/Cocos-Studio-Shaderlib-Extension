ccsl.lightSource = cc.Node.extend({
  DEFAULT_ATTRIBUTES: {
    INTENSITY: 1,
    COLOR: cc.color(255, 255, 255, 255),
    SIZE: cc.size(200, 200),
    ANCHOR: cc.p(0.5, 0.5)
  },

  ctor: function() {
    this._super();
    this.setEnabled(false);
    //register
    this.setIntensity(this.DEFAULT_ATTRIBUTES.INTENSITY);
    this.setColor(this.DEFAULT_ATTRIBUTES.COLOR);
    this.setContentSize(this.DEFAULT_ATTRIBUTES.SIZE);
    this.setAnchorPoint(this.DEFAULT_ATTRIBUTES.ANCHOR);
  },

  setIntensity: function(intensity) {
    this._intensity = intensity;
  },

  onEnter: function() {
    cc.Node.prototype.onEnter.apply(this, arguments);
    this.setEnabled(true);
  },

  setEnabled: function(enable) {
    this._enabled = enable;
  },

  cleanup: function() {
    cc.Node.prototype.cleanup.apply(this, arguments);
    //unregister
  }
});