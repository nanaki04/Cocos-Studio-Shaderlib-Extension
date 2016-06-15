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
    var materialData = {
      name: "new material"
    };
    ccssl.communicator.post(ccssl.paths.action, {
      action: "newMaterial",
      actionParameters: {
        material: materialData
      }
    }, function(result) {
      var savedMaterialData = result.result;
      var editWindow = new ccssl.MaterialEditWindow().init(savedMaterialData);
      var windowCollection = this._parent.getParent();
      var windowIndex = windowCollection.addChild(editWindow);
      windowCollection.showWindow(windowIndex);
      editWindow.focusMaterialNameTextbox();
      editWindow.selectMaterialNameTextBoxText();
    }.bind(this));
  }
});