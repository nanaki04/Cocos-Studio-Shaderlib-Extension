ccssl.Menu = ccssl.Class.define({
  DEFAULT_CSS: "menu-bar-bg",

  init: function(pos, itemSize, name, vertical) {
    this._menuItems = [];
    this._name = name;
    this._vertical = !!vertical;
    this._pos = pos;
    this._itemSize = itemSize;
    this.setCss(this.DEFAULT_CSS);
    this._element = this._createElement();
    this.redraw();
    return this;
  },

  getName: function() {
    return this._name;
  },

  getElement: function() {
    return this._element;
  },

  hide: function() {
    this._menuItems.forEach(function(menuItem) {
      menuItem.deselect();
    });
    this._element.style.display = "none";
  },

  show: function() {
    this._element.style.display = "block";
  },

  setRect: function(rect) {
    this.setPos({x: rect.x, y: rect.y});
    this.setSize({width: rect.width, height: rect.height});
  },

  setItemRect: function(rect) {
    this.setPos({x: rect.x, y: rect.y});
    this._itemSize = {width: rect.width, height: rect.height};
  },

  getRect: function() {
    return {
      x: this._pos.x,
      y: this._pos.y,
      width: this.getWidth(),
      height: this.getHeight()
    }
  },

  setPos: function(pos) {
    this._pos = pos;
  },

  setSize: function(size) {
    this.setWidth(size.width);
    this.setHeight(size.height);
  },

  addMenuItem: function(menuItem) {
    this._menuItems.push(menuItem);
    menuItem.setRect(this._calculateItemRect(this._menuItems.length - 1));
    menuItem.setParent(this);
    if (this._vertical) {
      this._element.style.height = (this._itemSize.height * this._menuItems.length) + "px";
    }
  },

  setCss: function(cssClassNames) {
    this._css = cssClassNames;
  },

  removeAllMenuItems: function() {
    this._menuItems.forEach(function(menuItem) {
      menuItem.remove();
    });
    this._menuItems = [];
  },

  getHeight: function() {
    if (this._element.style.display === "none") {
      return 0;
    }
    return this._vertical ? this._menuItems.length * this._itemSize.height : this._itemSize.height;
  },

  setHeight: function(height) {
    this._itemSize.height = this._vertical ? Math.round(height / this._menuItems.length) : height;
  },

  getWidth: function() {
    if (this._element.style.display === "none") {
      return 0;
    }
    return this._width || this.getElement().clientWidth;
  },

  setWidth: function(width) {
    this._width = width;
  },

  redraw: function() {
    var element = this.getElement();
    if (!this._vertical) {
      element.style.width = this._width ? this._width + "px" : "100%";
      element.style.height = this._itemSize.height + "px";
    } else {
      element.style.width = this._itemSize.width + "px";
    }
    element.style.left = this._pos.x + "px";
    element.style.top = this._pos.y + "px";
    this._menuItems.forEach(function(menuItem, index) {
      menuItem.setRect(this._calculateItemRect(index));
    }.bind(this));
  },

  _createElement: function() {
    var element = document.createElement("div");
    document.body.appendChild(element);
    element.className = this._css;
    element.style.position = "absolute";
    return element;
  },

  _calculateItemRect: function(index) {
    var itemSize = this._itemSize;
    var vertical = this._vertical;
    return {
      x: vertical ? 0 : index * itemSize.width,
      y: vertical ? index * itemSize.height : 0,
      width: itemSize.width,
      height: itemSize.height
    }
  }
});