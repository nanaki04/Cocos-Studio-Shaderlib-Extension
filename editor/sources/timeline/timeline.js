ccssl.Timeline = ccssl.Class.define({
  init: function() {
    this._element = this._createElement();
    this._refreshTimelineData(function(timelineData) {
      this._animationPulldown = this._initAnimationPulldown(timelineData);
      this._grid = this._initGrid(timelineData);
      this._loopCheckbox = this._initLoopCheckbox(timelineData);
      this._playButton = this._initPlayButton(timelineData);
      this._recordButton = this._initRecordButton(timelineData);
    }.bind(this));

    return this;
  },

  setRect: function(rect) {
    this._rect = rect;
  },

  getRect: function() {
    return this._rect || { x: 0, y: 0, width: 0, height: 0 };
  },

  redraw: function() {
    var element = this.getElement();
    var rect = this.getRect();
    element.style.top = rect.y + "px";
    element.style.left = rect.x + "px";
    element.style.width = rect.width + "px";
    element.style.height = rect.height + "px";

    this._animationPulldown.redraw();
    this._grid.redraw();
    this._loopCheckbox.redraw();
    this._playButton.redraw();
    this._recordButton.redraw();
  },

  reload: function() {
    this._refreshTimelineData(function(timelineData) {
      this._animationPulldown.reload(timelineData);
      this._grid.reload(timelineData);
      this._loopCheckbox.reload(timelineData);
      this._playButton.reload(timelineData);
      this._recordButton.reload(timelineData);
    }.bind(this));
  },

  getElement: function() {
    return this._element;
  },

  _refreshTimelineData: function(collectTimelineData) {
    ccssl.progressHandler.createTracker({})
      .add(function(timelineData, collectTimelineData) {
        ccssl.communicator.get(ccssl.paths.keyframes, function(keyframes) {
          timelineData.keyframes = keyframes;
          collectTimelineData(timelineData);
        });
      })
      .add(function(timelineData, collectTimelineData) {
        ccssl.communicator.get(ccssl.paths.animation, function(materialNodes) {
          timelineData.materialNodes = materialNodes;
          collectTimelineData(timelineData);
        });
      })
      .onEnd(function(timelineData) {
        collectTimelineData(timelineData);
      });
  },

  _createElement: function() {
    var element = document.createElement("div");
    element.style.overflow = "scroll";

    return element;
  },

  _initAnimationPulldown: function(timelineData) {
    return new ccssl.TimelineAnimationPulldown().init(timelineData);
  },

  _initGrid: function(timelineData) {
    return new ccssl.TimelineGrid().init(timelineData);
  },

  _initLoopCheckbox: function(timelineData) {
    return new ccssl.TimelineCheckbox().init(timelineData);
  },

  _initPlayButton: function(timelineData) {
    return new ccssl.TimelinePlayButton().init(timelineData);
  },

  _initRecordButton: function(timelineData) {
    return new ccssl.TimelineRecordButton().init(timelineData);
  }
});