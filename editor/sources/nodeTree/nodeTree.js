ccssl.NodeTree = ccssl.Class.define({
  init: function(rootElement) {
    this._toggle = this._initToggleButton();
    this._element = this._createElement(rootElement);
    this._treeElements = [];
  },

  openTree: function() {
    this._onToggleEnable();
  },

  closeTree: function() {
    this._onToggleDisable();
  },

  addTreeElement: function(element) {
    this._treeElements.push(element);
    this._element.content.appendChild(element);
  },

  removeTreeElement: function(element) {
    var index = this._treeElements.indexOf(element);
    if (!~index) {
      this._treeElements.splice(index, 1);
    }
    element.parentNode.removeChild(element);
  },

  remove: function() {
    this._toggle.remove();
    this._destroyElement();
  },

  _initToggleButton: function() {
    var toggle =  new ccssl.ToggleButton().init("+");
    toggle.setRect({
      x: 0,
      y: 0,
      width: 25,
      height: 25
    });
    toggle.addOnSelectEventListener(this._onToggleEnable, this);
    toggle.addOnDeselectEventListener(this._onToggleDisable, this);
    return toggle;
  },

  _createElement: function(rootElement) {
    var container = document.createElement("div");
    var header = document.createElement("div");
    var recordContainer = document.createElement("div");

    this._toggle.setParent(header);
    header.appendChild(rootElement);
    container.appendChild(header);
    container.appendChild(recordContainer);

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
