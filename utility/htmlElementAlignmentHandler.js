ccssl.HtmlElementAlignmentHandler = {
  alignRight: function(element) {
    this._registerWindowEvent("resize", this._alignRight.bind(this, element));
    this._alignRight(element);
  },

  stretchHeight: function(element, offset) {
    this._registerWindowEvent("resize", this._stretchHeight.bind(this, element, offset));
    this._stretchHeight(element, offset);
  },

  stretchWidth: function(element, offset) {
    this._registerWindowEvent("resize", this._stretchWidth.bind(this, element, offset));
    this._stretchWidth(element, offset);
  },

  cleanUp: function() {
    this._cleanUpWindowEvents();
  },

  _alignRight: function(element) {
    element.style.left = (document.body.clientWidth - parseInt(element.style.width)) + "px";
  },

  _stretchHeight: function(element, offset) {
    element.style.overflow = "auto";
    element.style.height = (document.body.clientHeight - parseInt(element.style.top) - (offset || 0)) + "px";
  },

  _stretchWidth: function(element, offset) {
    element.style.overflow = "auto";
    element.style.width = (document.body.clientWidth - parseInt(element.style.left) - (offset || 0)) + "px";
  },

  _registerWindowEvent: function(type, callback) {
    this.__windowEvents = this.__windowEvents || {};
    this.__windowEvents[type] = this.__windowEvents[type] || [];
    if (~this.__windowEvents[type].indexOf(callback)) this.__windowEvents[type].push(callback);
    window.addEventListener(type, callback);
  },

  _cleanUpWindowEvents: function() {
    var windowEvents = this.__windowEvents;
    var keys = Object.keys(windowEvents);
    keys.forEach(function(eventType) {
      windowEvents[eventType].forEach(function(callback) {
        window.removeEventListener(eventType, callback);
      });
    });
    this.__windowEvents = null;
  }
};
