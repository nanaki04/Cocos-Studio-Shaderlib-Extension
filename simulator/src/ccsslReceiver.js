ccssl.Receiver = cc.Class.extend({
  init: function() {
    this._registerMessageEvent();

    return this;
  },

  _registerMessageEvent: function() {
    window.addEventListener("message", this._handleMessage.bind(this));
  },

  _handleMessage: function(event) {
    console.log(event);
  },

  _decodeMessage: function(message) {

  }
});
