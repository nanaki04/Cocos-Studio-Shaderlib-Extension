ccssl.TimelineKeyframeDelegateBase = ccssl.Class.define({
  DEFAULT_COLOR: "",
  ON_HOVER_BACKGROUND_COLOR: "",

  init: function(parent) {
    this._parent = parent;

    return this;
  },

  getParent: function() {
    return this._parent;
  },

  onClick: function() {
    //enable record mode
    //open material edit window
  },

  onHover: function() {
    this._changeBackgroundColorToHover();
  },

  onMouseOut: function() {
    this._changeBackgroundColorToDefault();
  },

  getDefaultBackgroundColor: function() {
    return this.DEFAULT_COLOR;
  },

  getOnHoverBackgroundColor: function() {
    return this.ON_HOVER_BACKGROUND_COLOR;
  },

  _changeBackgroundColorToHover: function() {
    var color = this.getOnHoverBackgroundColor();
    this._changeBackgroundColor(color);
  },

  _changeBackgroundColorToDefault: function() {
    var color = this.getDefaultBackgroundColor();
    this._changeBackgroundColor(color);
  },

  _changeBackgroundColor: function(color) {
    var parent = this.getParent();
    if (!parent) {
      return;
    }
    console.log("changing bg color to " + color);
    parent.changeBackgroundColor(color);
  }
});
