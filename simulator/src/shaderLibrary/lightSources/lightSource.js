ccsl.lightSource = cc.Node.extend({
  DEFAULT_ATTRIBUTES: {
    INTENSITY: 1,
    COLOR: cc.color(255, 255, 255, 255),
    SIZE: cc.size(200, 200),
    ANCHOR: cc.p(0.5, 0.5),
    LIGHT_SOURCE_GROUP: "default"
  },

  ctor: function() {
    this._super();
    this.setIntensity(this.DEFAULT_ATTRIBUTES.INTENSITY);
    this.setColor(this.DEFAULT_ATTRIBUTES.COLOR);
    this.setContentSize(this.DEFAULT_ATTRIBUTES.SIZE);
    this.setAnchorPoint(this.DEFAULT_ATTRIBUTES.ANCHOR);
    this.setLightSourceGroup(this.DEFAULT_ATTRIBUTES.LIGHT_SOURCE_GROUP);
  },

  setIntensity: function(intensity) {
    this._intensity = intensity;
  },

  onEnter: function() {
    cc.Node.prototype.onEnter.apply(this, arguments);
    this.registerSelf();
  },

  setEnabled: function(enable) {
    if (enable) {
      this.registerSelf();
    } else {
      this.unregisterSelf();
    }
  },

  onExit: function() {
    cc.Node.prototype.onExit.apply(this, arguments);
    this.unregisterSelf();
  },

  cleanup: function() {
    cc.Node.prototype.cleanup.apply(this, arguments);
    this.unregisterSelf();
  },

  getLightSourceGroup: function() {
    return this._lightSourceGroup;
  },

  setLightSourceGroup: function(groupName) {
    if (groupName == null) {
      return;
    }
    var oldGroupName = this._lightSourceGroup;
    this._lightSourceGroup = groupName;
    if (this._registered) {
      ccsl.lightSourceHandler.updateLightSourceGroup(this, oldGroupName);
    }
  },

  registerSelf: function() {
    if (!this._registered) {
      this._registered = ccsl.lightSourceHandler.registerLightSource(this);
    }
  },

  unregisterSelf: function() {
    if (this._registered) {
      ccsl.lightSourceHandler.removeLightSource(this);
      this._registered = false;
    }
  },

  getWorldPosition: function() {
    return this.convertToWorldSpace(cc.p(this._anchorPoint.x * this._contentSize.width, this._anchorPoint.y * this._contentSize.height));
  }
});