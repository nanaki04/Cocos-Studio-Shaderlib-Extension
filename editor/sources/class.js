(function() {
  ccssl.Class = {
    define: function(properties) {
      var newClass = function() {};
      var proto = newClass.prototype;

      this.addProperties(properties, proto);
      newClass.extend = this._extend;

      return newClass;
    },

    _extend: function(properties) {
      var extendedClass = function() {};
      var originalProto = this.prototype;
      var extendedProto = extendedClass.prototype;

      ccssl.Class.addProperties(originalProto, extendedProto);
      ccssl.Class.addProperties(properties, extendedProto);
      extendedClass.extend = ccssl.Class._extend;
      extendedClass.prototype.base = originalProto;

      return extendedClass;
    },

    addProperties: function(properties, proto) {
      var keys = Object.keys(properties);
      keys.forEach(function(key) {
        proto[key] = properties[key];
      });
    }
  };
})();