ccssl.NewMaterialButton = ccssl.Button.extend({
  init: function() {
    ccssl.Button.prototype.init.apply(this, ["new", 10]);

    this.addOnClickEventListener(this._onClickNewMaterialButton, this);

    return this;
  },

  setParent: function(parent) {
    this._parent = parent;
  },

  _onClickNewMaterialButton: function() {
    //create new material backend
    var editWindow = new ccssl.MaterialEditWindow().init("new material");
    var windowCollection = this._parent.getParent();
    var windowIndex = windowCollection.addChild(editWindow);
    windowCollection.showWindow(windowIndex);
  }
});