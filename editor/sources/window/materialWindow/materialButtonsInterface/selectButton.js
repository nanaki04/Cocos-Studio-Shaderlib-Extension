ccssl.MaterialButtonsInterface.SelectButton = ccssl.ToggleButton.extend({
  init: function(material, buttonInterface) {
    ccssl.ToggleButton.prototype.init.call(this, material.name, 50);
    this._material = material;
    this._buttonInterface = buttonInterface;
    this.addOnSelectEventListener(this._onSelectMaterial, this);
    this.addOnDeselectEventListener(this._onDeselectMaterial, this);

    return this;
  },

  setSize: function(size) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.setSize.apply(this, arguments);
  },

  _applyMaterialToSelection: function(selectionType) {
    this.setEnabled(false);
    ccssl.nodeSelection.get(function(currentSelection) {
      ccssl.messageDispatcher.postMessage({
        message: "applyMaterial",
        material: this._material,
        selection: currentSelection
      });
    }.bind(this), selectionType);
    console.log("selectButton: posting apply material");
    ccssl.communicator.post(ccssl.paths.action, {
      action: "applyMaterial",
      actionParameters: {
        materialId: this._material.id,
        selection: selectionType
      }
    }, function() {
      console.log("selectButton: enabling");
      this.setEnabled(true);
    }.bind(this));
  },

  _onSelectMaterial: function() {
    this._applyMaterialToSelection("currentSelection");
  },

  _onDeselectMaterial: function() {

  }
});