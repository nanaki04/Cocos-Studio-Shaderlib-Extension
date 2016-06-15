ccssl.MaterialButtonsInterface.CopyButton = ccssl.MaterialButtonsInterface.ButtonBase.extend({
  init: function(material, buttonInterface) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.init.call(this, material, buttonInterface, "copy");
    this.addOnClickEventListener(this._onClickCopyButton, this);

    return this;
  },

  _onClickCopyButton: function() {

  }
});