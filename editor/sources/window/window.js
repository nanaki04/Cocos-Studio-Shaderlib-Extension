ccssl.Window = ccssl.Class.define({
  DEFAULT_CSS: {
    bg: {
      static: "window-bg",
      normal: "menu-item-bg",
      selected: "menu-item-bg-selected"
    },
    content: {
      font: "menu-item-font",
      normal: "menu-item",
      selected: "menu-item-selected"
    }
  },

  init: function(pos, windowSize, name) {
    this._name = name;
    this._pos = pos;
    this._windowSize = windowSize;
    this.setCss(this.DEFAULT_CSS);
    this._element = this._createElement(name);
    return this;
  },

  setName: function(name) {
    this._name = name;
  },

  getName: function() {
    return this._name;
  },

  setCss: function(css) {
    this._css = css;
  },

  setRect: function(rect) {
    this.setPos({x: rect.x, y: rect.y});
    this.setSize({width: rect.width, height: rect.height});
  },

  getRect: function() {
    return {
      x: this._pos.x,
      y: this._pos.y,
      width: this._windowSize.width,
      height: this._windowSize.height
    }
  },

  setPos: function(pos) {
    this._pos = pos;
  },

  getPos: function() {
    return this._pos;
  },

  setSize: function(size) {
    this._windowSize = size;
  },

  getSize: function() {
    return this._windowSize;
  },

  show: function() {
    this.getElement().style.display = "block";
  },

  hide: function() {
    this.getElement().style.display = "none";
  },

  redraw: function() {
    var element = this.getElement();
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";
    element.style.width = this._windowSize.width + "px";
    element.style.height = this._windowSize.height + "px";
  },

  _createElement: function(title) {
    var element = document.createElement("div");
    var table = document.createElement("table");
    var headerRow = document.createElement("tr");
    var contentRow = document.createElement("tr");
    var headerCell = document.createElement("td");
    var contentCell = document.createElement("td");

    element.style.position = "absolute";
    element.className = this._css.bg.static;
    element.style.height = this._windowSize.height + "px";
    element.style.width = this._windowSize.width + "px";
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";

    document.body.appendChild(element);
    this._addOnClickEventHandler(element);

    element.appendChild(table);
    table.appendChild(headerRow);
    headerRow.appendChild(headerCell);
    table.appendChild(contentRow);
    contentRow.appendChild(contentCell);

    table.style.height = "100%";
    table.style.width = "100%";

    headerRow.style.height = "50px";

    headerCell.innerHTML = title;

    table.className = this._css.content.normal;
    headerRow.className = this._css.bg.normal;
    contentRow.className = this._css.bg.static;
    headerCell.className = this._css.content.font;
    contentCell.className = this._css.content.font;
    contentCell.style.verticalAlign = "top";

    return {
      bg: element,
      header: headerCell,
      content: contentCell
    }
  },

  getElement: function() {
    return this._element.bg;
  },

  alignRight: function() {
    ccssl.HtmlElementAlignmentHandler.alignRight(this._element.bg);
  },

  stretchHeight: function() {
    ccssl.HtmlElementAlignmentHandler.stretchHeight(this._element.bg);
  },

  addContent: function(element) {
    this._element.content.appendChild(element);
  },

  _destroyElement: function() {
    this._element.bg.parentNode.removeChild(this._element.bg);
    //@todo remove event listener
  },

  _addOnClickEventHandler: function(element) {
    element.addEventListener("click", this._onClickCallback.bind(this));
  },

  _onClickCallback: function(event) {
    if (this._selected) {
      this.deselect();
    } else {
      this.select();
    }
    event.stopPropagation && event.stopPropagation();
    if (event.cancelBubble != null) event.cancelBubble = true;
  },

  select: function() {

  },

  deselect: function() {

  }
});