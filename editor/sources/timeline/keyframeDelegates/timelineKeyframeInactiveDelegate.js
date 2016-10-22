ccssl.TimelineKeyframeInactiveDelegate = ccssl.TimelineKeyframeDelegateBase.extend({
  DEFAULT_COLOR: "rgb(50, 50, 150)",
  ON_HOVER_BACKGROUND_COLOR: "rgb(130, 130, 255)",

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
