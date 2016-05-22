ccssl.Button = ccssl.Class.define({
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
    return this;
  },

  remove: function() {
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

  setTitle: function(title, maxCharacters) {
    this._name = title;
    this._element.label.innerHTML = this._shortenTitle(maxCharacters);
  },

  setParent: function(parent) {
    this._parent = parent;
    this._parent.appendChild(this._element.bg);
  },

  getParent: function() {
    return this._parent;
  },

  setCss: function(cssClassNames) {
    this._css = cssClassNames;
  },

  addOnClickEventListener: function(callback, context) {
    return this._eventHandler.addEventListener("click", callback, context);
  },

  removeOnSelectEventListener: function(listener) {
    return this._eventHandler.removeEventListener("click", listener);
  },

  removeAllEventListeners: function() {
    this._eventHandler.removeAllEventListeners();
  },

  onClick: function() {
    this._eventHandler.fireEvent("click", [this]);
  },

  getName: function() {
    return this._name;
  },

  getElement: function() {
    return this._element.bg;
  },

  _createElement: function(title) {
    var element = document.createElement("div");
    var table = document.createElement("table");
    var row = document.createElement("tr");
    var cell = document.createElement("td");

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
    this.onClick();
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