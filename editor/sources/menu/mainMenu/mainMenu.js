ccssl.MainMenu = ccssl.Menu.extend({
  MENU_ITEMS: [
    ccssl.MainMenuItems.Project,
    ccssl.MainMenuItems.File,
    ccssl.MainMenuItems.Nodes,
    ccssl.MainMenuItems.Materials,
    ccssl.MainMenuItems.History
  ],

  init: function() {
    ccssl.Menu.prototype.init.call(this,
      { x: 0, y: 0 },
      { width: 150, height: 50 },
      "main_menu",
      false
    );

    this._createMenuItems();

    return this;
  },

  _createMenuItems: function() {
    this.MENU_ITEMS.forEach(function(menuItem) {
      this.addMenuItem(new menuItem().init());
    }.bind(this));
  }
});