ccssl.Timeline = ccssl.Class.define({
  init: function() {
    this._element = this._createElement();
    this._refreshTimelineData(function(timelineData) {
      this._recordButton = this._initRecordButton(timelineData);
      this._recordModeLabel = this._initRecordModeLabel();
      this._currentFrameLabel = this._initCurrentFrameLabel();
      this._animationPulldown = this._initAnimationPulldown(timelineData);
      this._grid = this._initGrid(timelineData);
      this._loopCheckbox = this._initLoopCheckbox(timelineData);
      this._playButton = this._initPlayButton(timelineData);
      this._keyframeInfoPanel = this._initKeyframeInfoPanel();
      this._frameSlider = this._initFrameSlider();
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

    var headerHeight = 30;
    var contentHeight = rect.height - headerHeight;

    var contentStyle = this.getContentElement().style;
    contentStyle.height = contentHeight + "px";
    contentStyle.width = rect.width + "px";

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
    return this._element.root;
  },

  getContentElement: function() {
    return this._element.content;
  },

  getHeaderElement: function() {
    return this._element.header;
  },

  enableRecordMode: function() {
    this._recordButton.enableRecordMode();
    this._recordModeLabel.enableRecordMode();
  },

  disableRecordMode: function() {
    this._recordButton.disableRecordMode();
    this._recordModeLabel.disableRecordMode();
  },

  showKeyframeInfoPanel: function(keyframeData) {
    this._keyframeInfoPanel.showKeyframeInfo(keyframeData);
    this._keyframeInfoPanel.show();
  },

  hideKeyframeInfoPanel: function() {
    this._keyframeInfoPanel.hide();
  },

  changeCurrentFrame: function(frameIndex) {
    this._frameSlider.changeCurrentFrame(frameIndex);
  },

  isRecording: function() {
    return this._recordButton.isRecording();
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
    var root = document.createElement("div");
    root.className = "window-bg";
    root.style.position = "absolute";
    root.style.overflow = "hidden";

    var header = document.createElement("div");
    header.className = "window-bg";
    header.style.height = "30px";
    root.appendChild(header);

    var content = document.createElement("div");
    content.style.overflow = "auto";
    content.className = "window-bg";
    root.appendChild(content);

    document.body.appendChild(root);

    return {
      root: root,
      header: header,
      content: content
    };
  },

  _initAnimationPulldown: function(timelineData) {
    return new ccssl.TimelineAnimationPulldown().init(timelineData);
  },

  _initGrid: function(timelineData) {
    var timelineGrid = new ccssl.TimelineGrid().init(timelineData);
    this.getContentElement().appendChild(timelineGrid.getElement());

    return timelineGrid;
  },

  _initLoopCheckbox: function(timelineData) {
    return new ccssl.TimelineLoopCheckbox().init(timelineData);
  },

  _initPlayButton: function(timelineData) {
    var playButton = new ccssl.TimelinePlayButton().init(timelineData);
    playButton.setParent(this.getHeaderElement());

    return playButton;
  },

  _initRecordButton: function(timelineData) {
    var recordButton = new ccssl.TimelineRecordButton().init(timelineData);
    recordButton.setParent(this.getHeaderElement());

    return recordButton;
  },

  _initRecordModeLabel: function() {
    var recordModeLabel = new ccssl.TimelineRecordModeLabel()
      .init(
        {
          x: 0,
          y: 0,
          width: 200,
          height: 25
        }
      );
    if (this.isRecording()) {
      recordModeLabel.enableRecordMode();
    } else {
      recordModeLabel.disableRecordMode();
    }
    recordModeLabel.setParent(this);

    return recordModeLabel;
  },

  _initCurrentFrameLabel: function() {
    var frameLabel = new ccssl.TimelineCurrentFrameLabel()
      .init(
        {
          x: 0,
          y: 0,
          width: 200,
          height: 25
        }
      );
    frameLabel.setParent(this);
    frameLabel.changeFrame(0);

    return frameLabel;
  },

  _initKeyframeInfoPanel: function() {
    //todo
    //return new ccssl.TimelineKeyframeInfoPanel().init();
  },

  _initFrameSlider: function(timelineData) {
    return new ccssl.TimelineFrameSlider().init(timelineData);
  }
});
