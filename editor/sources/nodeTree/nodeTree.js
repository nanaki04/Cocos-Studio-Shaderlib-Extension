ccssl.NodeTree = ccssl.Class.define({
  DEFAULT_CSS: {
    EVEN_BG: "tree-even-bg",
    UNEVEN_BG: "tree-uneven-bg"
  },

  init: function(rootElement) {
    this._toggle = this._initToggleButton();
    this._rootElement = rootElement;
    this._element = this._createElement(rootElement.getElement(), parent);
    this._treeElements = [];
    this.setCss(this.DEFAULT_CSS);

    return this;
  },

  openTree: function() {
    this._onToggleEnable();
  },

  closeTree: function() {
    this._onToggleDisable();
  },

  setCss: function(cssClassNames) {
    this._css = cssClassNames;
  },

  addTreeElement: function(element) {
    var innerElementTable = document.createElement("table");
    var innerElementRow = document.createElement("tr");
    var innerElementIndentCell = document.createElement("td");
    var innerElementContentCell = document.createElement("td");

    innerElementIndentCell.innerHTML = "<b>|-</b>";
    innerElementIndentCell.style.verticalAlign = "top";
    innerElementIndentCell.style.width = "15px";
    innerElementContentCell.appendChild(element.getElement());

    innerElementRow.appendChild(innerElementIndentCell);
    innerElementRow.appendChild(innerElementContentCell);
    innerElementTable.appendChild(innerElementRow);

    innerElementTable.className = (this._treeElements.length % 2) ? this._css.EVEN_BG : this._css.UNEVEN_BG;

    this._treeElements.push({ class: element, html: innerElementTable });
    this._element.content.appendChild(innerElementTable);

    this.showToggle();
  },

  removeTreeElement: function(element) {
    var treeElement = this._treeElements.some(function(treeElement) {
      return treeElement.class === element;
    });

    if (!treeElement) {
      return;
    }

    var index = this._treeElements.indexOf(treeElement);
    if (!~index) {
      this._treeElements.splice(index, 1);
    }
    element.remove();
    treeElement.html.parentNode.removeChild(treeElement.html);

    if (!this._treeElements.length) {
      this.hideToggle();
    }
  },

  remove: function() {
    this._toggle.remove();
    this._rootElement.remove();
    this._destroyElement();
  },

  setParent: function(parent) {
    parent.appendChild(this._element.bg);
  },

  getElement: function() {
    return this._element.bg;
  },

  showToggle: function() {
    this._toggle.show();
  },

  hideToggle: function() {
    this._toggle.hide();
  },

  _initToggleButton: function() {
    var toggle =  new ccssl.ToggleButton().init("+");
    toggle.setRect({
      x: 0,
      y: 0,
      width: 40,
      height: 40
    });
    toggle.addOnSelectEventListener(this._onToggleEnable, this);
    toggle.addOnDeselectEventListener(this._onToggleDisable, this);
    toggle.hide();
    return toggle;
  },

  _createElement: function(rootElement) {
    var container = document.createElement("div");
    var header = document.createElement("div");
    var headerTable = document.createElement("table");
    var headerRow = document.createElement("tr");
    var headerToggleCell = document.createElement("td");
    var headerLabelCell = document.createElement("td");
    var recordContainer = document.createElement("div");

    this._toggle.setParent(headerToggleCell);
    headerLabelCell.appendChild(rootElement);
    headerRow.appendChild(headerToggleCell);
    headerRow.appendChild(headerLabelCell);
    headerTable.appendChild(headerRow);
    header.appendChild(headerTable);
    container.appendChild(header);
    container.appendChild(recordContainer);

    recordContainer.style.display = "none";

    return {
      bg: container,
      content: recordContainer
    }
  },

  _destroyElement: function() {
    this._element.bg.parentNode.removeChild(this._element.bg);
  },

  _onToggleEnable: function() {
    this._toggle.setTitle("-");
    this._openTree();
  },

  _onToggleDisable: function() {
    this._toggle.setTitle("+");
    this._closeTree();
  },

  _openTree: function() {
    this._element.content.style.display = "block";
  },

  _closeTree: function() {
    this._element.content.style.display = "none";
  }
});
