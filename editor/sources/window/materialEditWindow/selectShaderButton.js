ccssl.SelectShaderButton = ccssl.SelectMenuButton.extend({
  init: function(shaderName) {
    var title = shaderName || "Select Shader";
    ccssl.SelectMenuButton.prototype.init.call(this, title, 50);

    return this;
  },

  addOnChangeShaderEventListener: function(callback, context) {
    return this.addOnChangeItemEventListener(callback, context);
  },

  removeOnChangeShaderEventListener: function(eventListener) {
    this.removeOnSelectEventListener(eventListener);
  },

  _initSelectMenu: function(rect) {
    return new ccssl.SelectShaderMenu().init({x: rect.left, y: rect.top + rect.height}, {width: rect.width, height: 50}, this.getName());
  },

  _onSelectItem: function(shaderName) {
    this.setTitle(shaderName);
    this.deselect();
  },

  _getSelectionHandlerRegisterName: function() {
    return "select_shader_button";
  }
});