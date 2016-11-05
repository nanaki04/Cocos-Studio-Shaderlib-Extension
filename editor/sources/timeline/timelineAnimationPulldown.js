ccssl.TimelineAnimationPulldown = ccssl.SelectMenu.extend({
  init: function(pos, size, currentAnimation, animationData) {
    this._animationData = animationData;
    this.base.init.call(this, pos, size, "timeline_animation_pulldown", currentAnimation);

    return this;
  },

  _getMenuItems: function(collectMenuItems) {
    collectMenuItems(this._animationData.map(function(animationData) {
      return new ccssl.MenuItem().init(animationData.name, 50);
    }));
  },

  addOnSelectAnimationEventListener: function(callback, context) {
    return this.addOnSelectItemEventListener(callback, context);
  }
});
