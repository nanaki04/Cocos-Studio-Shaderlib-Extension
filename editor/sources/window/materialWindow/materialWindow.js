ccssl.MaterialWindow = ccssl.Window.extend({
  init: function() {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 0 },
      { width: 0, height: 0 },
      "Materials"
    );

    this._initNewButton();

    return this;
  },

  show: function() {
    ccssl.Window.prototype.show.apply(this, arguments);
    this.updateMaterialList(function() {});
  },

  updateMaterialList: function(done) {
    ccssl.communicator.get(ccssl.paths.materials, function(materials) {
      console.log(materials);
      done();
    });
  },

  _initNewButton: function() {
    this._newMaterialButton = new ccssl.NewMaterialButton().init();
    this._element.content.appendChild(this._newMaterialButton.getElement());
    this._newMaterialButton.setParent(this);
  },

  _initMaterialList: function() {

  }
});