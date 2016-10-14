ccssl.TimelineKeyframe = ccssl.Class.define({
  init: function(keyframeData, materialData) {
    this._keyframeData = keyframeData;
    this._materialData = materialData;
    this.reload();

    return this;
  },

  reload: function() {
    this._removeEvents();
    this._destroyElement();
    this._element = this._createElement();
    this._initEvents();
    this.redraw();
  },

  redraw: function() {

  },

  setActive: function() {
    this._isActive = true;
  },

  setInactive: function() {
    this._isActive = false;
  },

  isActive: function() {
    return this._isActive;
  },

  getKeyframeData: function() {
    return this._keyframeData;
  },

  getMaterialData: function() {
    return this._materialData;
  },

  _getTimeline: function() {
    return ccssl.componentHandler.getTimeline();
  },

  _createElement: function() {

  },

  _destroyElement: function() {

  },

  changeBackgroundColor: function(color) {

  },



  _initEvents: function() {
    this._initOnClickEvent();
    this._initOnHoverEvent();
    this._initOnMouseOutEvent();
  },

  _removeEvents: function() {
    this._removeOnClickEvent();
    this._removeOnHoverEvent();
    this._removeOnMouseOutEvent();
  },

  _initOnClickEvent: function() {

  },

  _initOnHoverEvent: function() {

  },

  _initOnMouseOutEvent: function() {

  },

  _removeOnClickEvent: function() {

  },

  _removeOnHoverEvent: function() {

  },

  _removeOnMouseOutEvent: function() {

  },

  _onClick: function() {

  },

  _onHover: function() {
    if (this.isActive()) {
      this._onHoverActiveKeyframe();
      return;
    }
    this._onHoverInactiveKeyframe();
  },

  _onMouseOut: function() {
    if (this.isActive()) {
      this._onMouseOutActiveKeyframe();
      return;
    }
    this._onMouseOutInactiveKeyframe();
  },

  _onClickActiveKeyframe: function() {

  },

  _onHoverActiveKeyframe: function() {
    this._highlightActiveBackground();
    var timeline = this._getTimeline();
    if (!timeline) {
      return;
    }
    timeline.showKeyframeInfoPanel(this._getKeyframeData());
  },

  _onHoverInactiveKeyframe: function() {
    this._highlightInactiveBackground();
  },

  _onMouseOutActiveKeyframe: function() {
    this._restoreActiveBackground();
  },

  _onMouseOutInactiveKeyframe: function() {
    this._restoreInactiveBackground();
  }
});
