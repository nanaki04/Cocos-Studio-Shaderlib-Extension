ccssl.SelectShaderMenu = ccssl.Menu.extend({
  init: function(pos, size) {
    ccssl.Menu.prototype.init.call(this,
      pos,
      size,
      "select_shader",
      true
    );

    this._eventHandler = new ccssl.EventHandler().init();
    this._createMenuItems();

    return this;
  },

  _createMenuItems: function() {
    ccssl.communicator.get(ccssl.paths.shaders, function(response) {
      (response || []).forEach(function(shader) {
        var menuItem = new ccssl.MenuItem().init(shader, 50);
        menuItem.addOnSelectEventListener(this._selectShader, this);
        this.addMenuItem(menuItem);
      }.bind(this));
    }.bind(this));
  },

  _selectShader: function(menuItem) {
    this._menuItems.forEach(function(_menuItem) {
      if (menuItem !== _menuItem) {
        _menuItem.deselect();
        _menuItem.setEnabled(true);
      }
    });
    menuItem.setEnabled(false);
    this._eventHandler.fireEvent("selectShader", [menuItem.getName()]);
  },

  addOnSelectShaderEventListener: function(callback, context) {
    return this._eventHandler.addEventListener("selectShader", callback, context);
  }
});