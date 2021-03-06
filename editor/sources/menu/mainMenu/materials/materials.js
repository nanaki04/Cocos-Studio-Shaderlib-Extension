ccssl.MainMenuItems.Materials = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "materials");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    return this;
  },

  _onSelectCallback: function(menuItem) {
    ccssl.communicator.get(ccssl.paths.shaders, function(response) {
      console.log(response);
    });
  },

  _onDeselectCallback: function(menuItem) {

  }
});