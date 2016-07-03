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
    this.setEnabled(false);
    ccssl.progressHandler.createSequence(this._nodeInfo.identifier)
      .add(function(identifier, done, sequenceHandler) {
        ccssl.nodeSelection.append(identifier, function(result) {
          if (!result) {
            sequenceHandler.forceEnd();
          }
          done(identifier);
        });
      })
      .add(function(identifier, done) {
        ccssl.communicator.post(ccssl.paths.action, {
          action: "selectNode",
          actionParameters: { nodes: [this._nodeInfo.identifier] }
        }, done);
      }.bind(this))
      .onEnd(function() {
        this.setEnabled(true);
        //todo revert cache on fail
      }.bind(this));
  },

  _onDeselectNodeButton: function() {
    this.setEnabled(false);
    ccssl.progressHandler.createTracker(this._nodeInfo.identifier)
      .add(function(identifier, done) {
        ccssl.nodeSelection.remove(identifier, done);
      })
      .add(function(identifier, done) {
        ccssl.communicator.post(ccssl.paths.action, {
          action: "deselectNode",
          actionParameters: { nodes: [this._nodeInfo.identifier] }
        }, done);
      }.bind(this))
      .onEnd(function() {
        this.setEnabled(true);
        //todo revert cache on fail
      }.bind(this));
  }
});