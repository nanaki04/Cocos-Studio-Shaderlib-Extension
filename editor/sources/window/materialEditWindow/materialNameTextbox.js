ccssl.MaterialNameTextbox = ccssl.Class.define({
  init: function(text) {
    this._element = this._createElement(text || "");

    return this;
  },

  addOnChangeEventListener: function(callback, context) {
    var eventListener = this._wrapOnChangeEventListener(callback, context);
    this._onChangeEvents = this._onChangeEvents || [];
    this._onChangeEvents.push(eventListener);
    this.getElement().addEventListener("change", eventListener);

    return eventListener;
  },

  focus: function() {
    this._element.focus();
  },

  select: function() {
    this._element.select();
  },

  _wrapOnChangeEventListener: function(callback, context) {
    return function(_callback, _context, _element) {
      _callback.call(_context, _element.value);
    }.bind(null, callback, context, this.getElement());
  },

  removeOnChangeEventListener: function(eventListener) {
    var index = (this._onChangeEvents || []).indexOf(eventListener);
    if (~index) {
      this._onChangeEvents.splice(index, 1);
      this.getElement().removeEventListener("change", eventListener);
    }
  },

  setParent: function(parent) {
    this._parent = parent;
  },

  getElement: function() {
    return this._element;
  },

  setText: function(text) {
    this.getElement().innerHTML = text;
  },

  redraw: function() {

  },

  remove: function() {
    this.getElement().parentNode.removeChild(this.getElement());
    (this._onChangeEvents || []).forEach(function(eventListener) {
      this.getElement().removeEventListener("change", eventListener);
    }.bind(this));
  },

  _createElement: function(text) {
    var element = document.createElement("input");
    element.type = "text";
    element.className = "textbox margin";
    element.value = text;

    return element;
  }
});