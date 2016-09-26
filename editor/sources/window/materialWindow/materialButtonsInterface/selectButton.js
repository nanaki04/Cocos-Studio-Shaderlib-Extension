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
    ccssl.progressHandler.createSequence(selectionType)
      .add(function(_selectionType, done) {
        ccssl.nodeSelection.get(function(currentSelection) {
          ccssl.messageDispatcher.postMessage({
            message: "applyMaterial",
            material: this._material,
            selection: currentSelection
          });
          done(_selectionType);
        }.bind(this), _selectionType);
      })
      .add(function(_selectionType, done) {
        ccssl.cache.materialNodes.update(this._material.id, selectionType, done);
      }.bind(this))
      .onEnd(this.setEnabled.bind(this, true));
  },

  _onSelectMaterial: function() {
    this._applyMaterialToSelection("currentSelection");
  },

  _onDeselectMaterial: function() {

  }
});