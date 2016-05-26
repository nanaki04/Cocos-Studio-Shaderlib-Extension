ccssl.MainMenu = ccssl.Menu.extend({
  init: function() {
    ccssl.Menu.prototype.init.call(this,
      { x: 0, y: 0 },
      { width: 150, height: 50 },
      "select ",
      false
    );

    this._createMenuItems();

    return this;
  },

  _createMenuItems: function() {
    //get shaders and show
  }
});