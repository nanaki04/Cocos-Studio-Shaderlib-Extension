ccssl.NodeWindow = ccssl.Window.extend({
  init: function() {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 50 },
      { width: 500, height: 800 },
      "Nodes"
    );

    this.alignRight();
    this.stretchHeight();

    return this;
  },

  drawNodes: function(nodeInfo) {
    if (this._nodeTree != null) {
      this._nodeTree.remove();
    }
    this._nodeTree = this._drawNodes(nodeInfo);
  },

  _drawNodes: function(nodeInfo) {
    if (nodeInfo == null) {
      return null;
    }

    var item;
    if (nodeInfo.tag == null) {
      item = new ccssl.NodeLabel().init(nodeInfo.name, 50);
    } else {
      item = new ccssl.NodeButton().init(nodeInfo.name, 50);
    }
    item.setNodeInfo(nodeInfo);

    var nodeTree = new ccssl.NodeWindowTree().init(item);
    nodeTree.setParent(this._element.content);

    (nodeInfo.children || []).forEach(function(child) {
      var subTree = this._drawNodes(child);
      if (subTree == null) {
        return;
      }
      nodeTree.addTreeElement(subTree);
    }.bind(this));

    if (nodeInfo.externalChildren && Object.keys(nodeInfo.externalChildren).length !== 0) {
      var subTree = this._drawNodes(nodeInfo.externalChildren);
      if (subTree == null) {
        return;
      }
      nodeTree.addTreeElement(subTree);
    }

    return nodeTree;
  }
});