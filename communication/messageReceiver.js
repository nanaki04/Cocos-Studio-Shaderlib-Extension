ccssl.Receiver = ccssl.Class.define({
  init: function() {
    this._registerMessageEvent();
    this._eventHandler = new ccssl.EventHandler().init();

    return this;
  },

  addOnLoadCallback: function(callback, context) {
    this._eventHandler.addEventListener("onLoad", callback, context);
  },

  removeOnLoadCallback: function(listener) {
    this._eventHandler.removeEventListener("onLoad", listener);
  },

  removeAllOnLoadCallbacks: function() {
    this._eventHandler.removeEventListeners("onLoad");
  },

  _registerMessageEvent: function() {
    window.addEventListener("message", this._handleMessage.bind(this));
  },

  _handleMessage: function(event) {
    var message = this._decodeMessage(event.data);
    this._eventHandler.fireEvent(message);
  },

  _decodeMessage: function(message) {
    return JSON.parse(message);
  }
});

ccssl.receiver = new ccssl.Receiver().init();
