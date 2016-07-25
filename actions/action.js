(function() {
  var action = function() {};
  var p = action.prototype;

  p._actionName = "abstract";

  p.init = function(parameters) {
    this._parameters = parameters;
    this._completed = false;
    this._id = 0;

    return this;
  };

  p.run = function(done) {
    done();
    this._completed = true;
  };

  p.revert = function(done) {
    done();
    this._completed = false;
  };

  p.setCompleted = function(completed) {
    this._completed = completed;
  };

  p.isCompleted = function() {
    return this._completed;
  };

  p.setId = function(id) {
    this._id = id;
  };

  p.getId = function() {
    return this._id;
  };

  p.toJSON = function() {
    return {
      actionName: this._actionName,
      parameters: this._parameters,
      completed: this._completed,
      id: this._id
    };
  };

  var extend = function(newProperties) {
    var extendedClass = function() {};
    var extendedPrototype = extendedClass.prototype;
    var keys = Object.keys(p);
    var newKeys = Object.keys(newProperties);

    extendedPrototype = keys.reduce(function(_p, key) {
      _p[key] = p[key];
      return _p;
    }, extendedPrototype);

    extendedPrototype = newKeys.reduce(function(_p, key) {
      _p[key] = newProperties[key];
      return _p;
    }, extendedPrototype);

    return extendedClass;
  };

  module.exports.create = action;
  module.exports.extend = extend;
})();