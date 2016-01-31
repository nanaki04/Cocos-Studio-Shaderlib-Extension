ccssl.ProjectMenu = ccssl.Menu.extend({
  MENU_ITEMS: [
    ccssl.ProjectMenuItems.Load,
    ccssl.ProjectMenuItems.Save
  ],

  init: function() {
    ccssl.Menu.prototype.init.call(this,
      { x: 0, y: 50 },
      { width: 150, height: 50 },
      "project_menu",
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