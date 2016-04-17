ccssl.MainMenuItems.Project = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "project");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    this._projectMenu = new ccssl.ProjectMenu().init();

    return this;
  },

  _onSelectCallback: function(menuItem) {
    this._projectMenu.show();
  },

  _onDeselectCallback: function(menuItem) {
    this._projectMenu.hide();
  }
});