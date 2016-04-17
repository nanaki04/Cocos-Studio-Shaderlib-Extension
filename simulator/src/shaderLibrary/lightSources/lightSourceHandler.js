ccsl.lightSourceHandler = cc.Class.extend({
  ctor: function() {
    this._lightSources = [];

  },

  registerLightSource: function(lightSource) {
    this._lightSources.push(lightSource);
  }
});