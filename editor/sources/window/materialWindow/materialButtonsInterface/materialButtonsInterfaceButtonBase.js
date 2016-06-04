ccssl.MaterialButtonsInterface.ButtonBase = ccssl.Button.extend({
  init: function(materialName, materialId, type) {
    ccssl.Button.prototype.init.call(this, type, 50);

    this._materialName = materialName;
    this._materialId = materialId;
  },

  setSize: function(size) {
    this.setRect({x: 0, y: 0, width: size.width, height: size.height});
  }
});