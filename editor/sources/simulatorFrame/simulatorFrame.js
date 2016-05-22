ccssl.SimulatorFrame = ccssl.Class.define({
  init: function() {
    return this;
  },

  setRect: function(rect) {
    this.setPos({x: rect.x, y: rect.y});
    this.setSize({width: rect.width, height: rect.height});
  },

  getRect: function() {
    return {
      x: this._pos.x,
      y: this._pos.y,
      width: this._size.width,
      height: this._size.height
    }
  },

  setPos: function(pos) {
    this._pos = pos;
  },

  getPos: function() {
    return this._pos;
  },

  setSize: function(size) {
    this._size = size;
  },

  getSize: function() {
    return this._size;
  },

  redraw: function() {
    var element = this.getElement();
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";
    element.style.width = this._size.width + "px";
    element.style.height = this._size.height + "px";
  },

  getElement: function() {
    return this._element || document.getElementById("simulator");
  }
});
