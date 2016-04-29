ccssl.MainMenuItems.Nodes = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "nodes");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    return this;
  },

  _onSelectCallback: function(menuItem) {
    //tmp
    ccssl.communicator.get(ccssl.paths.nodes, function() {

    });
  },

  _onDeselectCallback: function(menuItem) {

  }
});