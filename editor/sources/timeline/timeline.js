ccssl.Timeline = ccssl.Class.define({
  init: function() {
    this._element = this._createElement();
    this._refreshTimelineData(function(timelineData) {
      this._animationPulldown = this._initAnimationPulldown(timelineData);
      this._grid = this._initGrid(timelineData);
      this._loopCheckbox = this._initLoopCheckbox(timelineData);
      this._playButton = this._initPlayButton(timelineData);
      this._recordButton = this._initRecordButton(timelineData);
      this._keyframeInfoPanel = this._initKeyframeInfoPanel();
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

    this._animationPulldown && this._animationPulldown.redraw();
    this._grid && this._grid.redraw();
    this._loopCheckbox && this._loopCheckbox.redraw();
    this._playButton && this._playButton.redraw();
    this._recordButton && this._recordButton.redraw();
  },

  reload: function(done) {
    this._refreshTimelineData(function(timelineData) {
      this._animationPulldown.reload(timelineData);
      this._grid.reload(timelineData);
      this._loopCheckbox.reload(timelineData);
      this._playButton.reload(timelineData);
      this._recordButton.reload(timelineData);
      done();
    }.bind(this));
  },

  getElement: function() {
    return this._element;
  },

  enableRecordMode: function() {
    this._recordButton.enableRecordMode();
  },

  disableRecordMode: function() {
    this._recordButton.disableRecordMode();
  },

  showKeyframeInfoPanel: function(keyframeData) {
    this._keyframeInfoPanel.showKeyframeInfo(keyframeData);
    this._keyframeInfoPanel.show();
  },

  hideKeyframeInfoPanel: function() {
    this._keyframeInfoPanel.hide();
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
        ccssl.communicator.get(ccssl.paths.animation, function(animationData) {
          timelineData.animation = animationData;
          collectTimelineData(timelineData);
        });
      })
      .add(function(timelineData, collectTimelineData) {
        ccssl.cache.materials.getActiveMaterials(function(activeMaterials) {
          timelineData.activeMaterials = activeMaterials;
          collectTimelineData(timelineData);
        });
      })
      .onEnd(function(timelineData) {
        collectTimelineData(timelineData);
      });
  },

  _createElement: function() {
    var element = document.createElement("div");
    element.style.overflow = "auto";
    element.className = "window-bg";
    element.style.position = "absolute";
    document.body.appendChild(element);

    return element;
  },

  _initAnimationPulldown: function(timelineData) {
    return new ccssl.TimelineAnimationPulldown().init(timelineData);
  },

  _initGrid: function(timelineData) {
    var timelineGrid = new ccssl.TimelineGrid().init(timelineData);
    this.getElement().appendChild(timelineGrid.getElement());

    return timelineGrid;
  },

  _initLoopCheckbox: function(timelineData) {
    return new ccssl.TimelineLoopCheckbox().init(timelineData);
  },

  _initPlayButton: function(timelineData) {
    return new ccssl.TimelinePlayButton().init(timelineData);
  },

  _initRecordButton: function(timelineData) {
    return new ccssl.TimelineRecordButton().init(timelineData);
  },

  _initKeyframeInfoPanel: function() {
    //todo
    //return new ccssl.TimelineKeyframeInfoPanel().init();
  }
});
