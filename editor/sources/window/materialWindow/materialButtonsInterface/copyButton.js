ccssl.MaterialButtonsInterface.CopyButton = ccssl.MaterialButtonsInterface.ButtonBase.extend({
  init: function(materialName, materialId) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.init.call(this, materialName, materialId, "copy");
    this.addOnClickEventListener(this._onClickCopyButton, this);

    return this;
  },

  _onClickCopyButton: function() {

  }
});