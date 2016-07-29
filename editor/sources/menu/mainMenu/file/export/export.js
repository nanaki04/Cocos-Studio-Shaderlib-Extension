ccssl.FileMenuItems.Export = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "export");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    return this;
  },

  _onSelectCallback: function(menuItem) {
    ccssl.menuSelectionHandler.pause();
    ccssl.communicator.post(ccssl.paths.export, { target: "file" }, function() {
      ccssl.menuSelectionHandler.resume();
      ccssl.menuSelectionHandler.deselectAll();

      console.log("file exported");
    });
  },

  _onDeselectCallback: function(menuItem) {

  }
});