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

  drawNode: function(nodeInfo) {

  }
});