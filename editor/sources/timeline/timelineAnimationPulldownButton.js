ccssl.TimelineAnimationPulldownButton = ccssl.SelectMenuButton.extend({
  init: function(timelineData) {
    this._animations = timelineData.animation.animations;
    ccssl.SelectMenuButton.prototype.init.call(this, "ALL");

    return this;
  },

  addOnChangeAnimationEventListener: function(callback, context) {
    return this.addOnChangeItemEventListener(callback, context);
  },

  removeOnChangeAnimationEventListener: function(eventListener) {
    this.removeOnChangeEventListener(eventListener);
  },

  _initSelectMenu: function(rect) {
    return new ccssl.TimelineAnimationPulldown().init(
      {x: rect.left, y: rect.top + rect.height},
      {width: rect.width, height: 50},
      this.getName(),
      this._animations
    );
  },

  _onSelectItem: function(animationName) {
    this.setTitle(animationName);
    this.deselect();
  },

  _getSelectionHandlerRegisterName: function() {
    return "timeline_animation_pulldown_button";
  }
});
