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
    var message = this._decodeMessage(event.data);
    new ccssl.CommandCenter().run(message);
  },

  _decodeMessage: function(message) {
    return JSON.parse(message);
  }
});
