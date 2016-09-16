ccssl.NodeWindow = ccssl.Window.extend({
  init: function() {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 50 },
      { width: 500, height: 800 },
      "Nodes"
    );

    this.reload(function() {});

    return this;
  },

  reload: function(done) {
    ccssl.communicator.get(ccssl.paths.nodes, function(nodeInfo) {
      this.drawNodes(nodeInfo);
      done();
    }.bind(this));
  },

  drawNodes: function(nodeInfo) {
    if (this._nodeTree != null) {
      this._nodeTree.remove();
    }
    ccssl.nodeSelection.get(function(currentSelection) {
      this._nodeTree = this._drawNodes(nodeInfo, currentSelection);
    }.bind(this), "currentSelection");
  },

  _drawNodes: function(nodeInfo, currentSelection) {
    if (nodeInfo == null) {
      return null;
    }

    var item = this._initNodeItem(nodeInfo, currentSelection);
    var nodeTree = new ccssl.NodeWindowTree().init(item);
    nodeTree.setParent(this._element.content);

    (nodeInfo.children || []).forEach(function(child) {
      var subTree = this._drawNodes(child, currentSelection);
      if (subTree == null) {
        return;
      }
      nodeTree.addTreeElement(subTree);
    }.bind(this));

    if (nodeInfo.externalChildren && Object.keys(nodeInfo.externalChildren).length !== 0) {
      var subTree = this._drawNodes(nodeInfo.externalChildren, currentSelection);
      if (subTree == null) {
        return;
      }
      nodeTree.addTreeElement(subTree);
    }

    return nodeTree;
  },

  _initNodeItem: function(nodeInfo, currentSelection) {
    var classDefinition = !nodeInfo.identifier ? ccssl.NodeLabel : ccssl.NodeButton;
    var item = new classDefinition().init(nodeInfo.name, /* max title characters */ 50);
    var selectionIndex = currentSelection.indexOf(nodeInfo.identifier);
    item.setNodeInfo(nodeInfo);
    if (~selectionIndex) {
      item.select();
      currentSelection.splice(selectionIndex, 1);
    }

    return item;
  }
});