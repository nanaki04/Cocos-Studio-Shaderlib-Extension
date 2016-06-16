ccssl.MaterialEditWindow = ccssl.Window.extend({
  init: function(material) {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 0 },
      { width: 0, height: 0 },
      material.name
    );

    this._material = material;
    this._initMaterialNameTextbox(material.name);
    this._initSelectShaderButton(material.shader);
    this._initSaveButton();

    return this;
  },

  redraw: function() {
    this.base.redraw.apply(this);
    var rect = {x: 0, y: 0, width: this._windowSize.width - 30, height: 50};
    this._selectShaderButton.setRect(rect);
    this._saveButton.setRect(rect);
    this._selectShaderButton.redraw();
  },

  focusMaterialNameTextbox: function() {
    this._materialNameTextbox.focus();
  },

  selectMaterialNameTextBoxText: function() {
    this._materialNameTextbox.select();
  },

  _initMaterialNameTextbox: function(name) {
    this._materialNameTextbox = new ccssl.MaterialNameTextbox().init(name);
    this._element.content.appendChild(this._materialNameTextbox.getElement());
    this._materialNameTextbox.setParent(this);
    this._materialNameTextbox.addOnChangeEventListener(this._onChangeMaterialName, this);
  },

  _initSelectShaderButton: function(shaderName) {
    this._selectShaderButton = new ccssl.SelectShaderButton().init(shaderName);
    this._element.content.appendChild(this._selectShaderButton.getElement());
    this._selectShaderButton.setParent(this);
    this._selectShaderButton.addOnChangeShaderEventListener(function(shaderName) {
      this._material.shader = shaderName;
    }, this);
  },

  _initSaveButton: function() {
    this._saveButton = new ccssl.Button().init("save", 4);
    this._saveButton.setParent(this._element.content);
    this._saveButton.addOnClickEventListener(this._saveMaterial, this);
  },

  _onChangeMaterialName: function(name) {
    this.setName(name);
    this._material.name = name;
  },

  _saveMaterial: function() {
    ccssl.communicator.post(ccssl.paths.action, {
      action: "updateMaterial",
      actionParameters: {
        material: this._material
      }
    }, function() {});
  }

});