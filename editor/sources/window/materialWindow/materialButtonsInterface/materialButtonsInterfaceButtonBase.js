ccssl.MaterialButtonsInterface.ButtonBase = ccssl.Button.extend({
  init: function(material, buttonInterface, type) {
    ccssl.Button.prototype.init.call(this, type, 50);

    this._material = material;
    this._materialName = material.name;
    this._materialId = material.id;
    this._buttonInterface = buttonInterface;
  },

  setSize: function(size) {
    this.setRect({x: 0, y: 0, width: size.width, height: size.height});
  }
});