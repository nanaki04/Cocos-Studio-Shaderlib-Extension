ccssl.ComponentHandler = ccssl.Class.define({
  init: function() {
    return this;
  },

  reloadAll: function(done) {
    var tracker = ccssl.progressHandler.createTracker();
    this.getAllRegisteredComponents().forEach(function(registeredElement) {
      tracker.add(function(empty, _done) {
        registeredElement.reload(_done);
      });
    });
    tracker.onEnd(done);
  },

  getAllRegisteredComponents: function() {
    return ccssl.compositionHandler.getAllRegisteredElements();
  },

  getTimeline: function() {
    return ccssl.compositionHandler.getRegisteredElementByType(ccssl.compositionHandler.ELEMENT_TYPES.TIMELINE);
  }
});
