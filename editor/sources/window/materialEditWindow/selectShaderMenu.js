ccssl.SelectShaderMenu = ccssl.SelectMenu.extend({
  init: function(pos, size, currentShader) {
    this.base.init.call(this, pos, size, "select_shader_menu", currentShader);

    return this;
  },

  _getMenuItems: function(collectMenuItems) {
    ccssl.communicator.get(ccssl.paths.shaders, function(shaders) {
      var menuItems = (shaders || []).map(function(shader) {
        return new ccssl.MenuItem().init(shader, 50);
      });

      collectMenuItems(menuItems);
    });
  },

  addOnSelectShaderEventListener: function(callback, context) {
    return this.addOnSelectItemEventListener(callback, context);
  }
});