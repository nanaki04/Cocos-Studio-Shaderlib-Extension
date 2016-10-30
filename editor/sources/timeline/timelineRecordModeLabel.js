ccssl.TimelineRecordModeLabel = ccssl.Class.define({
  DEFAULT_CSS: {
    normal: "slim-border-inset inline-block",
    font: "menu-item-font"
  },

  init: function(rect) {
    this._text = "";
    this._rect = rect;
    this.setCss(this.DEFAULT_CSS);
    this.reload();

    return this;
  },

  setCss: function(css) {
    this._css = css;
  },

  reload: function() {
    this.redraw();
  },

  redraw: function() {
    this._destroyElement();
    this._element = this._createElement();
    this.setText(this._text || "");
    this.setRect(this._rect || {x: 0, y: 0, width: 0, height: 0});
    this.setParent(this._parent);
  },

  enableRecordMode: function() {
    this.setText("record mode: on");
  },

  disableRecordMode: function() {
    this.setText("record mode: off");
  },

  setText: function(text) {
    this._text = text;
    this._element.label.innerHTML = text;
  },

  setRect: function(rect) {
    this._rect = rect;
    var style = this._element.bg.style;
    style.top = rect.y + "px";
    style.left = rect.x + "px";
    style.width = rect.width + "px";
    style.height = rect.height + "px";
    style = this._element.table.style;
    style.width = rect.width;
  },

  setParent: function(parent) {
    if (parent == null) {
      return;
    }
    this._parent = parent;
    parent.getHeaderElement().appendChild(this.getElement());
  },

  getElement: function() {
    return this._element.bg;
  },

  _createElement: function() {
    var table = document.createElement("table");
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    var div = document.createElement("div");

    div.appendChild(table);
    table.appendChild(row);
    row.appendChild(cell);

    div.className = this._css.normal;
    table.style.position = "absolute";
    table.style.top = "-2px";
    cell.className = this._css.font;

    return {
      bg: div,
      table: table,
      label: cell
    }
  },

  _destroyElement: function() {
    if (!this._element) {
      return;
    }
    this._element.bg.parentNode.removeChild(this._element.bg);
    this._element = null;
  }
});
