ccssl.TimelineRecordButton = ccssl.ToggleButton.extend({
  CSS: {
    bg: {
      normal: "record-button-normal-bg",
      selected: "record-button-selected-bg"
    },
    content: {
      normal: "record-button-normal",
      selected: "record-button-selected",
      font: "menu-item-font"
    },
    holder: {
      normal: "slim-border-inset inline-block"
    }
  },

  init: function(timelineData) {
    this.base.init.call(this, "");
    this.setCss(this.CSS);
    this.redraw();
    this._initOnSelectEvents();

    return this;
  },

  redraw: function() {
    this._destroyElement();
    this._element = this._createElement(this._name);
    this.setRect({
      x: 0,
      y: 0,
      width: 25,
      height: 25
    });
  },

  reload: function() {
    this.redraw();
  },

  enableRecordMode: function() {
    if (this.isRecording()) {
      return;
    }
    this._isRecording = true;
    this.select();
    var timeline =  ccssl.componentHandler.getTimeline();
    timeline.enableRecordMode();
  },

  disableRecordMode: function() {
    if (!this.isRecording()) {
      return;
    }
    this._isRecording = false;
    this.deselect();
    var timeline =  ccssl.componentHandler.getTimeline();
    timeline.disableRecordMode();
  },

  isRecording: function() {
    return this._isRecording;
  },

  _createElement: function(name) {
    var element = this.base._createElement.call(this, name);
    var holder = document.createElement("div");
    if (this._css.holder) {
      holder.className = this._css.holder.normal;
    }
    holder.appendChild(element.bg);
    element.holder = holder;

    return element;
  },

  _destroyElement: function() {
    if (!this._element.holder || !this._element.holder.parentNode) {
      return;
    }
    this._element.holder.parentNode.removeChild(this._element.holder);
  },

  setParent: function(parent) {
    this._parent = parent;
    this._parent.appendChild(this._element.holder);
  },

  setRect: function(rect) {
    this.base.setRect.call(this, {
      x: rect.x,
      y: rect.y,
      width: rect.width - 4,
      height: rect.height - 4
    });
    var holder = this._element.holder;
    holder.style.top = rect.y;
    holder.style.left = rect.x;
    holder.style.width = rect.width;
    holder.style.height = rect.height;
  },

  _initOnSelectEvents: function() {
    this.addOnSelectEventListener(this.enableRecordMode, this);
    this.addOnDeselectEventListener(this.disableRecordMode, this);
  }
});
