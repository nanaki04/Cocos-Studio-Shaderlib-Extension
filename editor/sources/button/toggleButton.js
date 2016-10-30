ccssl.ToggleButton = ccssl.Button.extend({
  addOnSelectEventListener: function(callback, context) {
    return this._eventHandler.addEventListener("select", callback, context);
  },

  removeOnSelectEventListener: function(listener) {
    return this._eventHandler.removeEventListener("select", listener);
  },

  removeOnSelectEventListeners: function() {
    return this._eventHandler.removeEventListeners("select");
  },

  addOnDeselectEventListener: function(callback, context) {
    return this._eventHandler.addEventListener("deselect", callback, context);
  },

  removeOnDeselectEventListener: function(listener) {
    return this._eventHandler.removeEventListener("deselect", listener);
  },

  removeOnDeselectEventListeners: function() {
    return this._eventHandler.removeEventListeners("deselect");
  },

  removeAllEventListeners: function() {
    this._eventHandler.removeAllEventListeners();
  },

  select: function() {
    if (this._selected) {
      return;
    }
    this._selected = true;
    this._element.bg.className = this._element.bg.className.replace(this._css.bg.normal, this._css.bg.selected);
    this._element.item.className = this._element.item.className.replace(this._css.content.normal, this._css.content.selected);
    this._eventHandler.fireEvent("select", [this]);
  },

  deselect: function() {
    if (!this._selected) {
      return;
    }
    this._selected = false;
    this._element.bg.className = this._element.bg.className.replace(this._css.bg.selected, this._css.bg.normal);
    this._element.item.className = this._element.item.className.replace(this._css.content.selected, this._css.content.normal);
    this._eventHandler.fireEvent("deselect", [this]);
  },

  show: function() {
    this._element.bg.style.visibility = "visible";
  },

  hide: function() {
    this._element.bg.style.visibility = "hidden";
  },

  isSelected: function() {
    return this._selected;
  },

  _onClickCallback: function(event) {
    event.stopPropagation && event.stopPropagation();
    if (event.cancelBubble != null) event.cancelBubble = true;
    if (!this._enabled) {
      return;
    }
    if (this._selected) {
      this.deselect();
    } else {
      this.select();
    }
    this.onClick();
  }
});
