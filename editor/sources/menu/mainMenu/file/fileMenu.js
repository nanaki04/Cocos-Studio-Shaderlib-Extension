ccssl.FileMenu = ccssl.Menu.extend({
  MENU_ITEMS: [
    ccssl.FileMenuItems.Load,
    ccssl.FileMenuItems.Export
  ],

  init: function() {
    ccssl.Menu.prototype.init.call(this,
      { x: 150, y: 50 },
      { width: 150, height: 50 },
      "file_menu",
      true
    );

    this._createMenuItems();
    this.hide();

    return this;
  },

  _createMenuItems: function() {
    this.MENU_ITEMS.forEach(function(menuItem) {
      this.addMenuItem(new menuItem().init());
    }.bind(this));
  }
});