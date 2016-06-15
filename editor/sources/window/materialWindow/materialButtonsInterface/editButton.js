ccssl.MaterialButtonsInterface.EditButton = ccssl.MaterialButtonsInterface.ButtonBase.extend({
  init: function(material, buttonInterface) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.init.call(this, material, buttonInterface, "edit");
    this.addOnClickEventListener(this._onClickEditButton, this);

    return this;
  },

  _onClickEditButton: function() {
    var editWindow = new ccssl.MaterialEditWindow().init(this._material);
    var windowCollection = this._buttonInterface.getWindow().getWindowCollection();
    var windowIndex = windowCollection.addChild(editWindow);
    windowCollection.showWindow(windowIndex);
    editWindow.focusMaterialNameTextbox();
    editWindow.selectMaterialNameTextBoxText();
  }
});