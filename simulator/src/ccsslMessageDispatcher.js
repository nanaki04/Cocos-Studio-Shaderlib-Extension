ccssl.MessageDispatcher = cc.Class.extend({
  postMessage: function(message) {
    if (!window.parent) {
      return;
    }
    window.parent.postMessage(JSON.stringify(message), "*");
  }
});
