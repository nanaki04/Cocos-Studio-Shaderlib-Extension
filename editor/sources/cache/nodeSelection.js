ccssl.nodeSelection = {
  _nodeSelection: {},

  refresh: function(collectNodeSelection, identifier) {
    identifier = identifier || "currentSelection";
    ccssl.communicator.post(ccssl.paths.selection, {
      type: "get",
      identifier: identifier
    }, function(response) {
      this._nodeSelection[identifier] = response.selection;
      collectNodeSelection(response.selection.slice(0));
    }.bind(this));
  },

  set: function(nodeSelection, identifier, done) {
    identifier = identifier || "currentSelection";
    ccssl.communicator.post(ccssl.paths.selection, {
      type: "save",
      selection: nodeSelection,
      identifier: identifier
    }, function() {
      this._nodeSelection[identifier] = nodeSelection;
    });
  },

  get: function(collectNodeSelection, identifier) {
    identifier = identifier || "currentSelection";
    if (this._nodeSelection[identifier]) {
      return collectNodeSelection(this._nodeSelection[identifier].slice(0));
    }
    this.refresh(collectNodeSelection, identifier);
  }
};
