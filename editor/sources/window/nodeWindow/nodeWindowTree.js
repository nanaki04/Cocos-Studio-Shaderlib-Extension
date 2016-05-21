ccssl.NodeWindowTree = ccssl.NodeTree.extend({
  init: function(rootNode) {
    ccssl.NodeTree.prototype.init.apply(this, arguments);

    return this;
  }
});
