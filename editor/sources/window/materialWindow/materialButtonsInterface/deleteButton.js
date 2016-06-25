ccssl.MaterialButtonsInterface.DeleteButton = ccssl.MaterialButtonsInterface.ButtonBase.extend({
  init: function(material, buttonInterface) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.init.call(this, material, buttonInterface, "delete");
    this.addOnClickEventListener(this._onClickDeleteButton, this);

    return this;
  },

  _onClickDeleteButton: function() {
    ccssl.communicator.post(ccssl.paths.action, {
      action: "deleteMaterial",
      actionParameters: {
        materialId: this._materialId
      }
    }, function() {
      this._buttonInterface.remove();
    }.bind(this));
    //todo remove material from nodes in the simulator
  }
});