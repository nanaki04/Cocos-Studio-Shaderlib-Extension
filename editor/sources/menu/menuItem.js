ccssl.MenuItem = ccssl.Class.define({
  DEFAULT_CSS: {
    bg: {
      normal: "menu-item-bg",
      selected: "menu-item-bg-selected"
    },
    content: {
      font: "menu-item-font",
      normal: "menu-item",
      selected: "menu-item-selected"
    }
  },

  init: function(title, maxCharacters) {
    this._name = title;
    this._element = this._createElement(this._shortenTitle(maxCharacters));
    this.setCss(this.DEFAULT_CSS);
    this._eventHandler = new ccssl.EventHandler().init();
    this.setEnabled(true);
    return this;
  },

  remove: function() {
    if (this._selected) {
      this.deselect();
    }
    this.removeAllEventListeners();
    this._destroyElement();
    this._parent = null;
    this._css = null;
    this._eventHandler = null;
  },

  setRect: function(rect) {
    var element = this._element.bg;
    element.style.top = rect.y + "px";
    element.style.left = rect.x + "px";
    element.style.width = rect.width + "px";
    element.style.height = rect.height + "px";
  },

  setParent: function(parent) {
    this._parent = parent;
    this._parent.getElement().appendChild(this._element.bg);
  },

  setCss: function(cssClassNames) {
    this._css = cssClassNames;
  },

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
    if (this._selected || !this._enabled) {
      return;
    }
    ccssl.menuSelectionHandler.select(this, this._parent.getName());
    this._selected = true;
    this._element.bg.className = this._element.bg.className.replace(this._css.bg.normal, this._css.bg.selected);
    this._element.item.className = this._element.item.className.replace(this._css.content.normal, this._css.content.selected);
    this._eventHandler.fireEvent("select", [this]);
  },

  deselect: function() {
    if (!this._selected || !this._enabled) {
      return;
    }
    ccssl.menuSelectionHandler.clear(this._parent.getName());
    this._selected = false;
    this._element.bg.className = this._element.bg.className.replace(this._css.bg.selected, this._css.bg.normal);
    this._element.item.className = this._element.item.className.replace(this._css.content.selected, this._css.content.normal);
    this._eventHandler.fireEvent("deselect", [this]);
  },

  isSelected: function() {
    return this._selected;
  },

  setEnabled: function(enable) {
    this._enabled = enable;
  },

  getName: function() {
    return this._name;
  },

  _createElement: function(title) {
    var element = document.createElement("div");
    var table = document.createElement("table");
    var row = document.createElement("tr");
    var cell = document.createElement("td");

    element.style.position = "absolute";
    element.className = "menu-item-bg";

    this._addOnClickEventHandler(element);

    element.appendChild(table);
    table.appendChild(row);
    row.appendChild(cell);

    cell.innerHTML = title;

    table.className = "menu-item";
    cell.className = "menu-item-font";

    return {
      bg: element,
      item: table,
      label: cell
    };
  },

  _destroyElement: function() {
    this._element.bg.parentNode.removeChild(this._element.bg);
    //@todo remove event listener
  },

  _addOnClickEventHandler: function(element) {
    element.addEventListener("click", this._onClickCallback.bind(this));
  },

  _onClickCallback: function(event) {
    if (!this._enabled) {
      return;
    }
    if (this._selected) {
      this.deselect();
    } else {
      this.select();
    }
    event.stopPropagation && event.stopPropagation();
    if (event.cancelBubble != null) event.cancelBubble = true;
  },

  _shortenTitle: function(maxCharacter) {
    if (!maxCharacter) {
      return this._name;
    }
    if (this._name.length <= maxCharacter) {
      return this._name;
    }
    return "..." + this._name.substring(this._name.length - maxCharacter - 3);
  }
});