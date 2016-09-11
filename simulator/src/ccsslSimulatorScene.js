ccssl.SimulatorScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    this.mainLayer = new cc.Layer();
    this.addChild(this.mainLayer);
    this._setupScroller();
    this._loadSelectedCssFile();
    new ccssl.MessageDispatcher().postMessage("onLoad");
  },

  getLoadedResourceNode: function() {
    if (!this._loadedResource) {
      return null;
    }
    return this._loadedResource.node;
  },

  getLoadedResourceAction: function() {
    if (!this._loadedResource) {
      return null;
    }
    return this._loadedResource.action;
  },

  _loadSelectedCssFile: function() {
    var selectedCssFile = this._getSelectedCssFile();
    if (!selectedCssFile)
      return false;
    var ccsObject = ccs.load(selectedCssFile);
    if (!ccsObject)
      return false;
    ccsObject.node.runAction(ccsObject.action);
    this._scroller.addChild(ccsObject.node);
    this._loadedResource = ccsObject;
    return true;
  },

  _getSelectedCssFile: function() {
    var projectResources = cc.loader.getRes(res.project_resources);
    if (!projectResources)
      return null;
    return projectResources.res[0];
  },

  _setupScroller: function() {
    this._scroller = new ccssl.Scroller().initialize(cc.winSize);
    this.mainLayer.addChild(this._scroller);
  }
});
