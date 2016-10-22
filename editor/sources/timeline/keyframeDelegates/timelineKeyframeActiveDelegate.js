ccssl.TimelineKeyframeActiveDelegate = ccssl.TimelineKeyframeDelegateBase.extend({
  DEFAULT_COLOR: "rgb(150, 0, 0)",
  ON_HOVER_BACKGROUND_COLOR: "rgb(250, 0, 0)",

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