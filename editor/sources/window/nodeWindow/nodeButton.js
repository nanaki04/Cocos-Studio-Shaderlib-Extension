ccssl.NodeButton = ccssl.ToggleButton.extend({
  init: function(title, maxCharacters) {
    ccssl.ToggleButton.prototype.init.apply(this, arguments);

    this.addOnSelectEventListener(this._onSelectNodeButton, this);
    this.addOnDeselectEventListener(this._onDeselectNodeButton, this);

    return this;
  },

  setNodeInfo: function(nodeInfo) {
    this._nodeInfo = nodeInfo;
  },

  getNodeInfo: function() {
    return this._nodeInfo;
  },

  _onSelectNodeButton: function() {
    ccssl.communicator.post(ccssl.paths.action, {
      action: "selectNode",
      actionParameters: { nodes: [this._nodeInfo.tag] }
    }, function() {
      console.log("select node: " + this._nodeInfo.tag);
    }.bind(this));
  },

  _onDeselectNodeButton: function() {
    ccssl.communicator.post(ccssl.paths.action, {
      action: "deselectNode",
      actionParameters: { nodes: [this._nodeInfo.tag] }
    }, function() {
      console.log("deselect node: " + this._nodeInfo.tag);
    }.bind(this));
  }
});