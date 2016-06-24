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

  set: function(nodeSelection, done, identifier) {
    identifier = identifier || "currentSelection";
    ccssl.communicator.post(ccssl.paths.selection, {
      type: "save",
      selection: nodeSelection,
      identifier: identifier
    }, function() {
      this._nodeSelection[identifier] = nodeSelection;
      done && done(nodeSelection);
    }.bind(this));
  },

  get: function(collectNodeSelection, identifier) {
    identifier = identifier || "currentSelection";
    if (this._nodeSelection[identifier]) {
      return collectNodeSelection(this._nodeSelection[identifier].slice(0));
    }
    this.refresh(collectNodeSelection, identifier);
  },

  append: function(nodeId, done, identifier) {
    this.get(function() {
      identifier = identifier || "currentSelection";
      var nodeSelection = this._nodeSelection[identifier];
      if (!~nodeSelection.indexOf(nodeId)) {
        nodeSelection.push(nodeId);
      }
      done && done(this._nodeSelection[identifier]);
    }.bind(this), identifier);
  },

  remove: function(nodeId, done, identifier) {
    var nodeSelection = this.get(function() {
      identifier = identifier || "currentSelection";
      var nodeSelection = this._nodeSelection[identifier];
      var index = nodeSelection.indexOf(nodeId);
      if (~index) {
        nodeSelection.slice(index, 1);
      }
      done && done(nodeSelection);
    }.bind(this), identifier);
  },

  update: function(done, identifier) {
    this.get(function(nodeSelection) {
      this.set(nodeSelection, identifier, done);
    }.bind(this), identifier);
  }
};
