ccssl.WindowCollection = ccssl.Class.define({
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

  init: function(pos, windowSize) {
    this._pos = pos;
    this._windowSize = windowSize;
    this.setCss(this.DEFAULT_CSS);
    this._element = this._createElement();
    this._windows = [];
    this._tabButtons = [];
    return this;
  },

  addChild: function(tabWindow) {
    if (~this._windows.indexOf(tabWindow)) {
      return;
    }
    this._windows.push(tabWindow);
    this._addTabButton(tabWindow.getName());
    this._element.content.appendChild(tabWindow.getElement());
    tabWindow.setParent(this);
    tabWindow.setRect({ x: 0, y: 50, width: this._windowSize.width, height: this._windowSize.height });
    tabWindow.redraw();
    tabWindow.hide();
    if (this._windows.length === 1) {
      this._tabButtons[0].select();
    }

    tabWindow.addOnNameChangeEvent(this._onWindowNameChange, this);

    return this._windows.length - 1;
  },

  _onWindowNameChange: function(tabWindow, name) {
    var index = this._windows.indexOf(tabWindow);
    if (!~index) {
      return;
    }
    var tabButton = this._tabButtons[index];
    tabButton.setTitle(name, 75 / Math.round(this._windows.length));
  },

  removeWindow: function(tabWindow) {
    var index = this._windows.indexOf(tabWindow);
    if (!~index) {
      return;
    }
    this._removeTabButton(index);
    this._element.content.removeChild(tabWindow.getElement());
    this._windows.splice(index, 1);

    if (index > 0) {
      this.showWindow(index - 1);
    } else if (this._windows.length) {
      this.showWindow(0);
    }
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
    size.height = Math.max(size.height - 50, 0);
    this._windowSize = size;
    (this._windows || []).forEach(function(_window) {
      _window.setSize(size);
    });
  },

  getSize: function() {
    return this._windowSize;
  },

  redraw: function() {
    var element = this.getElement();
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";
    element.style.width = this._windowSize.width + "px";
    element.style.height = this._windowSize.height + "px";
    (this._windows || []).forEach(function(_window) {
      _window.redraw();
    });
  },

  _createElement: function() {
    var element = document.createElement("div");
    var content = document.createElement("div");
    var tabButtons = document.createElement("table");
    var tabRow = document.createElement("tr");

    tabButtons.style.height = "50px";

    element.style.position = "absolute";
    element.className = this._css.bg.static;
    element.style.height = this._windowSize.height + "px";
    element.style.width = this._windowSize.width + "px";
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";

    document.body.appendChild(element);

    element.appendChild(tabButtons);
    tabButtons.appendChild(tabRow);
    element.appendChild(content);


    return {
      bg: element,
      tab: tabRow,
      content: content
    }
  },

  _addTabButton: function(name) {
    var tabButton = new ccssl.ToggleButton().init(name, 150 / Math.round(this._windows.length));
    tabButton.setParent(document.createElement("td"));
    tabButton.addOnSelectEventListener(this._onSelectTabButton, this);
    tabButton.addOnDeselectEventListener(this._onDeselectTabButton, this);
    this._tabButtons.push(tabButton);
    this._element.tab.appendChild(tabButton.getParent());
    this._recalculateTabButtonNames();
  },

  _removeTabButton: function(index) {
    var tabButton = this._tabButtons[index];
    tabButton.getParent().parentNode.removeChild(tabButton.getParent());
    tabButton.remove();
    this._tabButtons.splice(index, 1);
    this._recalculateTabButtonNames();
  },

  _recalculateTabButtonNames: function() {
    this._tabButtons.forEach(function(tabButton) {
      var name = tabButton.getName();
      tabButton.setTitle(name, 75 / Math.round(this._windows.length));
    }.bind(this));
  },

  showWindow: function(index) {
    this._tabButtons[index].select();
  },

  hideWindow: function(index) {
    this._tabButtons[index].deselect();
    this._windows[index].hide();
  },

  _onSelectTabButton: function(toggleButton) {
    var index = this._tabButtons.indexOf(toggleButton);
    this._tabButtons.forEach(function(tabButton, _index) {
      if (index === _index) {
        return;
      }
      tabButton.deselect();
    });
    this._windows[index].show();
  },

  _onDeselectTabButton: function(toggleButton) {
    this.hideWindow(this._tabButtons.indexOf(toggleButton));
  },

  getElement: function() {
    return this._element.bg;
  },

  _destroyElement: function() {
    this._element.bg.parentNode.removeChild(this._element.bg);
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

  },

  reload: function(done) {
    done && done();
  }
});