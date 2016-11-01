ccssl.SelectMenuButton = ccssl.ToggleButton.extend({
  DEFAULT_CSS: {
    bg: {
      normal: "menu-item-bg margin",
      selected: "menu-item-bg-selected margin"
    },
    content: {
      font: "menu-item-font",
      normal: "menu-item",
      selected: "menu-item-selected"
    }
  },

  init: function(title, maxTitleLength) {
    ccssl.ToggleButton.prototype.init.apply(this, [title, maxTitleLength]);

    this.addOnSelectEventListener(this._onSelectMenuButton, this);
    this.addOnDeselectEventListener(this._onDeselectMenuButton, this);

    var rect = this._getMenuItemRect();
    this._selectMenu = this._initSelectMenu(rect);

    this._selectMenu.addOnSelectItemEventListener(this._onSelectItem, this);
    this._selectMenu.hide();

    return this;
  },

  _getMenuItemRect: function() {
    return this.getElement().getBoundingClientRect();
  },

  _initSelectMenu: function(rect) {
    return new ccssl.SelectMenu().init({x: rect.left, y: rect.top + rect.height}, {width: rect.width, height: 50}, this.getName());
  },

  setParent: function(parent) {
    this._parent = parent;
  },

  redraw: function() {
    var rect = this._getMenuItemRect();
    this._selectMenu.setItemRect({x: rect.left, y: rect.top + rect.height, width: rect.width, height: 50});
    this._selectMenu.redraw();
  },

  remove: function() {
    this._selectMenu.remove();
    ccssl.ToggleButton.prototype.remove.call(this);
  },

  addOnChangeItemEventListener: function(callback, context) {
    return this._selectMenu.addOnSelectItemEventListener(callback, context);
  },

  removeOnChangeItemEventListener: function(eventListener) {
    this._selectMenu.removeOnSelectEventListener(eventListener);
  },

  _onSelectMenuButton: function() {
    ccssl.menuSelectionHandler.select(this, this._getSelectionHandlerRegisterName());
    this._selectMenu.show();
  },

  _onDeselectMenuButton: function() {
    ccssl.menuSelectionHandler.clear(this._getSelectionHandlerRegisterName());
    this._selectMenu.hide();
  },

  _onSelectItem: function(itemName) {

  },

  _getSelectionHandlerRegisterName: function() {
    return this.getName();
  }
});