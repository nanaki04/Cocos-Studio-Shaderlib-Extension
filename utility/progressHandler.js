(function() {
  var progressHandler = {
    createSequence: function(startingValue) {
      return new sequenceTracker(startingValue);
    },

    createTracker: function(startingValue) {
      return new tracker(startingValue);
    }
  };

  var tracker = function(startingValue) {
    this._value = startingValue;
    this._count = 0;
    this._progress = 0;
    this._endState = 0;

    this.add = function(asyncFunction, context) {
      var index = this._count;
      this._endState |= 1 << index;
      this._count++;
      asyncFunction.call(context, this._value, this._onProc.bind(this, index), this);

      return this;
    };

    this.onEnd = function(callback, context) {
      this._onEndEventCallback = {
        callback: callback,
        context: context
      };

      return this;
    };

    this.forceEnd = function() {
      this._fireEndEvent();
      this._cleanUp();
    };

    this.forceUpdate = function() {
      if (this._progress === this._endState) {
        this._fireEndEvent();
        this._cleanUp();
      }
    };

    this._onProc = function(index, value) {
      this._value = value;
      this._progress |= 1 << index;
      if (this._progress === this._endState) {
        this._fireEndEvent();
        this._cleanUp();
      }
    };

    this._fireEndEvent = function() {
      var cb = this._onEndEventCallback;
      cb && cb.callback.call(cb.context, this._value);
    };

    this._cleanUp = function() {
      this._callbacks = null;
      this._progress = null;
      this._onEndEventCallback = null;
    };
  };

  var sequenceTracker = function(startingValue) {
    this._value = startingValue;
    this._callbacks = [];
    this._progress = 0;

    this.add = function(callback, context) {
      var index = this._callbacks.length;

      this._callbacks.push({
        callback: callback,
        context: context
      });

      (!index || this._progress & 1 << index - 1) && this._fireCallback(index);

      return this;
    };

    this.onEnd = function(callback, context) {
      this._onEndEventCallback = {
        callback: callback,
        context: context
      };

      return this;
    };

    this.forceEnd = function() {
      this._fireEndEvent();
      this._cleanUp();
    };

    this._fireCallback = function(index) {
      var cb = this._callbacks[index];
      if (!cb) {
        this._fireEndEvent();
        this._cleanUp();
      }
      cb && cb.callback.call(cb.context, this._value, this._onProc.bind(this, index), this);
    };

    this._onProc = function(index, value) {
      this._value = value;
      this._progress |= 1 << index;
      this._fireCallback(index + 1);
    };

    this._fireEndEvent = function() {
      var cb = this._onEndEventCallback;
      cb && cb.callback.call(cb.context, this._value);
    };

    this._cleanUp = function() {
      this._callbacks = null;
      this._progress = null;
      this._onEndEventCallback = null;
    };
  };

  if (module) {
    module.exports.createTracker = progressHandler.createTracker;
    module.exports.createSequence = progressHandler.createSequence;
  } else {
    ccssl.progressHandler = progressHandler;
  }
})();
