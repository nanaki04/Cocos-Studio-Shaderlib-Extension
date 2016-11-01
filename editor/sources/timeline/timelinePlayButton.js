ccssl.TimelinePlayButton = ccssl.ToggleButton.extend({
  CSS: {
    holder: {
      normal: "slim-border-inset inline-block"
    }
  },

  init: function(timelineData) {
    this.base.init.call(this, "");
    this._initCss();
    this.redraw();
    this._initOnSelectEvents();
    this.stop();

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

  play: function() {
    this._element.label.innerHTML = "■";
  },

  stop: function() {
    this._element.label.innerHTML = "▶"
  },

  _createElement: function(name) {
    var element = this.base._createElement.call(this, name);
    var holder = document.createElement("div");
    if (this._css.holder) {
      holder.className = this._css.holder.normal;
    }
    holder.appendChild(element.bg);
    element.holder = holder;
    element.label.style.fontSize = "8px";

    return element;
  },

  _destroyElement: function() {
    if (!this._element.holder || !this._element.holder.parentNode) {
      return;
    }
    this._element.holder.parentNode.removeChild(this._element.holder);
  },

  _initCss: function() {
    var defaultKeys = Object.keys(this.DEFAULT_CSS);
    this.CSS = defaultKeys.reduce(function(css, defaultKey) {
      css[defaultKey] = this.DEFAULT_CSS[defaultKey];

      return css;
    }.bind(this), this.CSS);

    this.setCss(this.CSS);
  },

  setParent: function(parent) {
    this._parent = parent;
    this._parent.appendChild(this._element.holder);
  },

  setRect: function(rect) {
    this.base.setRect.call(this, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    });
    var holder = this._element.holder;
    holder.style.top = rect.y;
    holder.style.left = rect.x;
    holder.style.width = rect.width;
    holder.style.height = rect.height;
  },

  _initOnSelectEvents: function() {
    this.addOnSelectEventListener(this.play, this);
    this.addOnDeselectEventListener(this.stop, this);
  }
});
