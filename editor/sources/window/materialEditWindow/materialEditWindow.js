ccssl.MaterialEditWindow = ccssl.Window.extend({
  init: function(name) {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 0 },
      { width: 0, height: 0 },
      name
    );

    this._initMaterialNameTextbox(name);
    this._initSelectShaderButton();

    return this;
  },

  redraw: function() {
    this.base.redraw.apply(this);
    this._selectShaderButton.redraw();
  },

  _initMaterialNameTextbox: function(name) {
    this._materialNameTextbox = new ccssl.MaterialNameTextbox().init(name);
    this._element.content.appendChild(this._materialNameTextbox.getElement());
    this._materialNameTextbox.setParent(this);
    this._materialNameTextbox.addOnChangeEventListener(this._onChangeMaterialName, this);
  },

  _initSelectShaderButton: function() {
    this._selectShaderButton = new ccssl.SelectShaderButton().init();
    this._element.content.appendChild(this._selectShaderButton.getElement());
    this._selectShaderButton.setParent(this);
  },

  _onChangeMaterialName: function(name) {
    this.setName(name);
  }

});