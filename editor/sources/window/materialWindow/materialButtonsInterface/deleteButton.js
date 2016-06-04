ccssl.MaterialButtonsInterface.DeleteButton = ccssl.MaterialButtonsInterface.ButtonBase.extend({
  init: function(materialName, materialId) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.init.call(this, materialName, materialId, "delete");
    this.addOnClickEventListener(this._onClickDeleteButton, this);

    return this;
  },

  _onClickDeleteButton: function() {

  }
});