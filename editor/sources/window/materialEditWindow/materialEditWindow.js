ccssl.MaterialEditWindow = ccssl.Window.extend({
  init: function(name) {
    ccssl.Window.prototype.init.call(this,
      { x: 0, y: 0 },
      { width: 0, height: 0 },
      name
    );

    return this;
  }

});