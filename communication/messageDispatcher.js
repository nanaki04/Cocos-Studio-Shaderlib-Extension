ccssl.messageDispatcher = {
  postMessage: function(message) {
    var frame = ccssl.SimulatorFrame.prototype.getElement();
    frame.contentWindow.postMessage(JSON.stringify(message), "*");
  }
};
