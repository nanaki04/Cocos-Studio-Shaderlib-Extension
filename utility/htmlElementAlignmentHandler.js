ccssl.HtmlElementAlignmentHandler = {
  EVENT_TYPES: {
    alignRight: "alignRight",
    alignLeft: "alignLeft",
    stretchHeight: "stretchHeight",
    stretchWidth: "stretchWidth"
  },

  _stretchWidthEvents: [],
  _stretchHeightEvents: [],
  _alignRightEvents: [],
  _alignLeftEvents: [],

  alignRight: function(element, offset) {
    var eventType = this.EVENT_TYPES.alignRight;
    this._removeExistingEvent(element, eventType);
    var callback = this._alignRight.bind(this, element, offset);
    this._registerWindowEvent(eventType, callback);
    this._alignRight(element, offset);
    this._alignRightEvents.push(this._createEvent(element, callback));
  },

  alignLeft: function(element, offset) {
    var eventType = this.EVENT_TYPES.alignLeft;
    this._removeExistingEvent(element, eventType);
    var callback = this._alignRight.bind(this, element, offset);
    this._registerWindowEvent(eventType, callback);
    this._alignRight(element, offset);
    this._alignRightEvents.push(this._createEvent(element, callback));
  },

  stretchHeight: function(element, offset) {
    var eventType = this.EVENT_TYPES.stretchHeight;
    this._removeExistingEvent(element, eventType);
    var callback = this._stretchHeight.bind(this, element, offset);
    this._registerWindowEvent(eventType, callback);
    this._stretchHeight(element, offset);
    this._stretchHeightEvents.push(this._createEvent(element, callback));
  },

  stretchWidth: function(element, offset) {
    var eventType = this.EVENT_TYPES.stretchWidth;
    this._removeExistingEvent(element, eventType);
    var callback = this._stretchWidth.bind(this, element, offset);
    this._registerWindowEvent(eventType, callback);
    this._stretchWidth(element, offset);
    this._stretchWidthEvents.push(this._createEvent(element, callback));
  },

  _createEvent: function(element, callback) {
    return {
      type: "resize",
      element: element,
      callback: callback
    }
  },

  _removeExistingEvent: function(element, type) {
    var cache = this._getCacheObjectByType(type);
    cache.forEach(function(event) {
      if (event.element === element) {
        this._removeEventByType(event, type);
      }
    }.bind(this));
  },

  _getCacheObjectByType: function(type) {
    return this["_" + type + "Events"];
  },

  cleanUp: function() {
    this._cleanUpWindowEvents();
  },

  _alignRight: function(element, offset) {
    element.style.left = (document.body.clientWidth - parseInt(element.style.width) - (offset || 0)) + "px";
  },

  _alignLeft: function(element, offset) {
    element.style.left = (offset || 0) + "px";
  },

  _stretchHeight: function(element, offset) {
    element.style.overflow = "auto";
    element.style.height = (document.body.clientHeight - parseInt(element.style.top) - (offset || 0)) + "px";
  },

  _stretchWidth: function(element, offset) {
    element.style.overflow = "auto";
    element.style.width = (document.body.clientWidth - parseInt(element.style.left) - (offset || 0)) + "px";
  },

  _registerWindowEvent: function(type, event) {
    this._removeExistingEvent(event.element, type);
    this._getCacheObjectByType(type).push(event);
    window.addEventListener(event.type, event.callback);
  },

  _cleanUpWindowEvents: function() {
    this.EVENT_TYPES.forEach(function(eventType) {
      this._getCacheObjectByType(eventType).forEach(function(event) {
        this._removeEvent(event);
      }.bind(this));
      this["_" + eventType + "Events"] = [];
    }.bind(this));
  },

  _removeEventByType: function(event, type) {
    this._removeEvent(event);
    var cache = this._getCacheObjectByType(type);
    var index = cache.indexOf(event);
    if (~index) {
      cache.splice(index, 1);
    }
  },

  _removeEvent: function(event) {
    window.removeEventListener(event.type, event.callback);
  }
};
