ccssl.TimelineKeyframe = ccssl.Class.define({
  init: function(keyframeData, materialData) {
    this._keyframeData = keyframeData;
    this._materialData = materialData;
    this.reload();

    return this;
  },

  reload: function() {
    this.destroy();
    this._element = this._createElement();
    this._initActivity();
    this._initEvents();
    this.redraw();
  },

  redraw: function() {
    this._setDefaultColor();
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

  getElement: function() {
    return this._element;
  },

  getKeyframeData: function() {
    return this._keyframeData;
  },

  getMaterialData: function() {
    return this._materialData;
  },

  destroy: function() {
    this._removeEvents();
    this._destroyElement();
  },

  _initActivity: function() {
    var keyframeData = this._keyframeData;
    if (keyframeData == null || Object.keys(keyframeData).length === 0) {
      this.setInactive();
      return;
    }
    this.setActive();
  },

  _setupEventDelegate: function() {
    if (this.isActive()) {
      this._eventDelegate = new ccssl.TimelineKeyframeActiveDelegate().init(this);
      return;
    }
    this._eventDelegate = new ccssl.TimelineKeyframeInactiveDelegate().init(this);
  },

  _createElement: function() {
    var element = document.createElement("div");
    element.style.width = "25px";
    element.style.height = "25px";

    return element;
  },

  _destroyElement: function() {
    if (this._element == null || this._element.parentNode == null) {
      return;
    }
    this._element.parentNode.removeChild(this._element);
  },

  changeBackgroundColor: function(color) {
    this._element.style.backgroundColor = color;
  },


  _initEvents: function() {
    this._setupEventDelegate();
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
    this._onClickEvent = this._onClick.bind(this);
    this._element.addEventListener("click", this._onClickEvent);
  },

  _initOnHoverEvent: function() {
    this._onHoverEvent = this._onHover.bind(this);
    this._element.addEventListener("mouseover", this._onHoverEvent);
  },

  _initOnMouseOutEvent: function() {
    this._onMouseOutEvent = this._onMouseOut.bind(this);
    this._element.addEventListener("mouseout", this._onMouseOutEvent);
  },

  _removeOnClickEvent: function() {
    if (!this._onClickEvent) {
      return;
    }
    this._element.removeEventListener("click", this._onClickEvent);
    this._onClickEvent = null;
  },

  _removeOnHoverEvent: function() {
    if (!this._onHoverEvent) {
      return;
    }
    this._element.removeEventListener("click", this._onHoverEvent);
    this._onHoverEvent = null;
  },

  _removeOnMouseOutEvent: function() {
    if (!this._onMouseOutEvent) {
      return;
    }
    this._element.removeEventListener("click", this._onMouseOutEvent);
    this._onMouseOutEvent = null;
  },

  _onClick: function() {
    this._eventDelegate.onClick();
  },

  _onHover: function() {
    this._eventDelegate.onHover();
  },

  _onMouseOut: function() {
    this._eventDelegate.onMouseOut();
  },

  _setDefaultColor: function() {
    this.changeBackgroundColor(this._eventDelegate.getDefaultBackgroundColor());
  }
});
