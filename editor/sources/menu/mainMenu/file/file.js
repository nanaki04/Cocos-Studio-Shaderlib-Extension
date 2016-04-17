ccssl.MainMenuItems.File = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "file");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    this._fileMenu = new ccssl.FileMenu().init();

    return this;
  },

  _onSelectCallback: function(menuItem) {
    this._fileMenu.show();
  },

  _onDeselectCallback: function(menuItem) {
    this._fileMenu.hide();
  }
});