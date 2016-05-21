ccssl.NodeLabel = ccssl.Class.define({
  init: function(title, maxCharacters) {
    this._name = title;
    this._element = this._createElement(this._shortenTitle(maxCharacters));

    return this;
  },

  remove: function() {
    this._destroyElement();
  },

  setParent: function() {
    this._parent = parent;
    this._parent.appendChild(this._element);
  },

  getElement: function() {
    return this._element;
  },

  _destroyElement: function() {
    this._element.parentNode.removeChild(this._element);
  },

  setNodeInfo: function(nodeInfo) {
    this._nodeInfo = nodeInfo;
  },

  getNodeInfo: function() {
    return this._nodeInfo;
  },

  _createElement: function(title) {
    var element = document.createElement("div");
    element.innerHTML = title;
    return element;
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