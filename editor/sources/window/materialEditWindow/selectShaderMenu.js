ccssl.SelectShaderMenu = ccssl.Menu.extend({
  init: function(pos, size, currentShader) {
    ccssl.Menu.prototype.init.call(this,
      pos,
      size,
      "select_shader",
      true
    );

    this._eventHandler = new ccssl.EventHandler().init();
    this._createMenuItems(currentShader);

    return this;
  },

  remove: function() {
    this.removeAllMenuItems();
    this._eventHandler.removeAllEventListeners();
  },

  _createMenuItems: function(currentShader) {
    ccssl.communicator.get(ccssl.paths.shaders, function(response) {
      (response || []).forEach(function(shader) {
        var menuItem = new ccssl.MenuItem().init(shader, 50);

        this.addMenuItem(menuItem);
        if (shader === currentShader) {
          menuItem.select();
          menuItem.setEnabled(false);
        }
        menuItem.addOnSelectEventListener(this._selectShader, this);
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