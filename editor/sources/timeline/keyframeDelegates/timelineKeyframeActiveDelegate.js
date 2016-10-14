ccssl.TimelineKeyframeActiveDelegate = ccssl.Class.define({
  DEFAULT_COLOR: "",
  ON_HOVER_BACKGROUND_COLOR: "",

  onClick: function() {
    this.base.onClick.call(this);
  },

  onHover: function() {
    this.base.onHover.call(this);
    var timeline =  ccssl.componentHandler.getTimeline();
    if (!timeline) {
      return;
    }
    timeline.showKeyframeInfoPanel(this.base.getKeyframeData.call(this));
  },

  onMouseOut: function() {
    this.base.onMouseOut.call(this);
  }
});