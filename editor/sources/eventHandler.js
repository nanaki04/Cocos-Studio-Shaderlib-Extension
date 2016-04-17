ccssl.EventHandler = ccssl.Class.define({
  init: function() {
    this._listeners = {};
    return this;
  },

  addEventListener: function(group, callback, context) {
    var listener = {
      callback: callback,
      context: context
    };

    this._listeners[group] = this._listeners[group] || [];
    this._listeners[group].push(listener);

    return listener;
  },

  removeEventListener: function(group, listener) {
    var groupListeners = this._listeners[group];
    var index = groupListeners.indexOf(listener);

    if (index === -1) return false;

    groupListeners.splice(index, 1);

    return true;
  },

  removeEventListeners: function(group) {
    if (!this._listeners[group]) return false;

    delete this._listeners[group];

    return true;
  },

  removeAllEventListeners: function() {
    this._listeners = {};
  },

  fireEvent: function(group, args) {
    var groupListeners = this._listeners[group];

    if (!groupListeners) return;

    return groupListeners.map(function(listener) {
      return listener.callback.apply(listener.context, args);
    });
  }
});