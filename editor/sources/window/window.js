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
    this._closeButton = this._initCloseButton();
    this._eventHandler = new ccssl.EventHandler().init();

    return this;
  },

  addOnNameChangeEvent: function(callback, context) {
    return this._eventHandler.addEventListener("name_change", callback, context);
  },

  removeOnNameChangeEvent: function(eventListener) {
    return this._eventHandler.removeEventListener("name_change", eventListener);
  },

  setName: function(name) {
    this._name = name;
    this._element.header.innerHTML = name;
    this._eventHandler.fireEvent("name_change", [this, name]);
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
    var content = this._element.content;
    var contentHeight = this._windowSize.height - 75;
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";
    element.style.width = this._windowSize.width + "px";
    element.style.height = this._windowSize.height + "px";
    content.style.height = contentHeight + "px";
    console.log(contentHeight);
    this._element.closeButton.style.left = (this._windowSize.width - 57) + "px";
  },

  remove: function() {
    this._closeButton.remove();
    this._destroyElement();
    this._eventHandler.remove();
  },

  setParent: function(parent) {
    this._parent = parent;
  },

  getParent: function() {
    return this._parent;
  },

  getWindowCollection: function() {
    return this.getParent();
  },

  _createElement: function(title) {
    var element = document.createElement("div");
    var table = document.createElement("table");
    var headerRow = document.createElement("tr");
    var contentRow = document.createElement("tr");
    var headerCell = document.createElement("td");
    var closeButtonHolder = document.createElement("div");
    var contentCell = document.createElement("td");
    var contentDiv = document.createElement("div");

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
    headerRow.appendChild(closeButtonHolder);
    table.appendChild(contentRow);
    contentRow.appendChild(contentCell);
    contentCell.appendChild(contentDiv);

    table.style.height = "100%";
    table.style.width = "100%";

    headerRow.style.height = "50px";

    headerCell.innerHTML = title;

    table.className = this._css.content.normal;
    headerRow.className = this._css.bg.normal;
    contentRow.className = this._css.bg.static;
    headerCell.className = this._css.content.font;
    contentDiv.className = this._css.content.font;
    contentCell.style.verticalAlign = "top";
    contentDiv.style.overflow = "auto";
    closeButtonHolder.style.width = "50px";
    closeButtonHolder.style.position = "absolute";


    return {
      bg: element,
      header: headerCell,
      closeButton: closeButtonHolder,
      content: contentDiv
    }
  },

  _initCloseButton: function() {
    var closeButton = new ccssl.Button().init("x", 1);
    closeButton.addOnClickEventListener(function() {
      var windowCollection = this.getWindowCollection();
      if (windowCollection) {
        windowCollection.removeWindow(this);
      } else {
        this.remove();
      }
    }, this);
    closeButton.setParent(this._element.closeButton);
    closeButton.setRect({x: 0, y: 0, width: 50, height: 50});

    return closeButton;
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