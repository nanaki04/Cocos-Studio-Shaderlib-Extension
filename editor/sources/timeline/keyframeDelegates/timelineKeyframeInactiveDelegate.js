ccssl.TimelineKeyframeActiveDelegate = ccssl.Class.define({
  DEFAULT_COLOR: "",
  ON_HOVER_BACKGROUND_COLOR: "",

  onClick: function() {
    this.base.onClick.call(this);
  },

  onHover: function() {
    this.base.onHover.call(this);
  },

  onMouseOut: function() {
    this.base.onMouseOut.call(this);
  }
});
