ccssl.TimelineKeyframeInfoPanel = ccssl.Window.extend({
  init: function() {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 50 },
      { width: 250, height: 500 },
      "Keyframe Info"
    );

    return this;
  },

  showKeyframeInfo: function(keyframeData) {
    console.log("todo: implement keyframe info panel")
  }
});
