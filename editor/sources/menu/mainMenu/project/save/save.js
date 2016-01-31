ccssl.ProjectMenuItems.Save = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "save");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    return this;
  },

  _onSelectCallback: function(menuItem) {

  },

  _onDeselectCallback: function(menuItem) {

  }
});