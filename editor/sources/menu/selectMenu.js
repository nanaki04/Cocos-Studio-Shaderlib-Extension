ccssl.SelectMenu = ccssl.Menu.extend({
  init: function(pos, size, name, currentItem) {
    ccssl.Menu.prototype.init.call(this,
      pos,
      size,
      name,
      true
    );

    this._eventHandler = new ccssl.EventHandler().init();
    this._createMenuItems(currentItem);

    return this;
  },

  show: function() {
    this._selectedItem.select();
    ccssl.Menu.prototype.show.call(this);
  },

  remove: function() {
    this.removeAllMenuItems();
    this._eventHandler.removeAllEventListeners();
  },

  _createMenuItems: function(currentItem) {
    this._getMenuItems(function(menuItems) {
      (menuItems || []).forEach(function(menuItem) {
        this.addMenuItem(menuItem);
        if (menuItem.getName() === currentItem) {
          this._selectedItem = menuItem;
          menuItem.setEnabled(true);
          menuItem.select();
          menuItem.setEnabled(false);
        }
        menuItem.addOnSelectEventListener(this._selectItem, this);
      }.bind(this));
    }.bind(this));
  },

  _getMenuItems: function() {
    return [];
  },

  _selectItem: function(menuItem) {
    this._selectedItem = menuItem;
    this._menuItems.forEach(function(_menuItem) {
      if (menuItem !== _menuItem) {
        _menuItem.setEnabled(true);
        _menuItem.deselect();
      }
    });
    menuItem.setEnabled(false);
    this._eventHandler.fireEvent("selectItem", [menuItem.getName()]);
  },

  addOnSelectItemEventListener: function(callback, context) {
    return this._eventHandler.addEventListener("selectItem", callback, context);
  },

  removeOnChangeItemEventListener: function(eventListener) {
    this._eventHandler.removeEventListener("selectItem", eventListener);
  }
});