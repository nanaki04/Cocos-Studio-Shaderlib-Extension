ccssl.MaterialButtonsInterface.EditButton = ccssl.MaterialButtonsInterface.ButtonBase.extend({
  init: function(materialName, materialId) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.init.call(this, materialName, materialId, "edit");
    this.addOnClickEventListener(this._onClickCopyButton, this);

    return this;
  },

  _onClickCopyButton: function() {

  }
});