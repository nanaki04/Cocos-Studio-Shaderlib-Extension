ccssl.MaterialButtonsInterface.SelectButton = ccssl.ToggleButton.extend({
  init: function(materialName, materialId) {
    ccssl.ToggleButton.prototype.init.call(this, materialName, 50);
    this._materialName = materialName;
    this._materialId = materialId;
    this.addOnSelectEventListener(this._onSelectMaterial, this);
    this.addOnDeselectEventListener(this._onDeselectMaterial, this);

    return this;
  },

  setSize: function(size) {
    ccssl.MaterialButtonsInterface.ButtonBase.prototype.setSize.apply(this, arguments);
  },

  _onSelectMaterial: function() {

  },

  _onDeselectMaterial: function() {

  }
});