//DEBUG PURPOSES ONLY
if (module) {
  require('../utility/jsExtensions');
}
//___________________

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
    this._progress = [];
    this._endState = [];
    this._done = false;

    this.add = function(asyncFunction, context) {
      if (this._done) {
        return this;
      }
      var index = this._count;
      this._updateEndState(index);
      this._count++;

      setTimeout(
        asyncFunction.bind(context, this._value, this._onProc.bind(this, index), this),
        1
      );

      return this;
    };

    this.onEnd = function(callback, context) {
      if (this._done) {
        callback.call(context, this._value, this);
        return;
      }
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
      if (this._progressEqualsEndState()) {
        this._fireEndEvent();
        this._cleanUp();
      }
    };

    //DEBUG PURPOSES ONLY
    this.showProgress = function() {
      if (this._progress == null) {
        console.log("trying to show progress of an already ended progress");
        console.log(this._instanceID);
        return;
      }
      var popCount = this._progress.reduce(function(_popCount, progress, index) {
        console.log("index: " + index + ", progress: " + progress.toString(2));
        return _popCount + progress.popCount();
      }.bind(this), 0);
      console.log(popCount + "/" + this._count);
    };

    this._onProc = function(index, value) {
      if (this._done) {
        return;
      }
      this._value = value;
      this._setProgressFinished(index);
      if (this._progressEqualsEndState()) {
        this._fireEndEvent();
        this._cleanUp();
      }
    };

    this._fireEndEvent = function() {
      var cb = this._onEndEventCallback;
      cb && cb.callback.call(cb.context, this._value);
    };

    this._cleanUp = function() {
      this._progress = null;
      this._endState = null;
      this._onEndEventCallback = null;
      this._value = null;
      this._count = null;
      this._done = true;
    };

    this._getProgress = function(index) {
      var progressIndex = this._getProgressIndex(index);
      this._progress[progressIndex] = this._progress[progressIndex] || 0;
      return this._progress[progressIndex];
    };

    this._getProgressIndex = function(index) {
      return Math.floor(index / 32);
    };

    this._setProgressFinished = function(index) {
      var progressIndex = this._getProgressIndex(index);
      this._progress[progressIndex] |= 1 << index;
    };

    this._getEndStateIndex = function(index) {
      return Math.floor(index / 32);
    };

    this._updateEndState = function(index) {
      if (this._endState == null) {
        return;
      }
      this._endState[this._getEndStateIndex(index)] |= 1 << index;
    };

    this._progressEqualsEndState = function() {
      if (this._progress == null || this._endState == null) {
        return false;
      }
      if (this._progress.length !== this._endState.length) {
        return false;
      }
      return !this._progress.some(function(progress, index) {
        return progress !== this._endState[index];
      }.bind(this));
    };
  };

  var sequenceTracker = function(startingValue) {
    this._value = startingValue;
    this._callbacks = [];
    this._progress = [];
    this._done = false;

    this.add = function(callback, context) {
      if (this._done) {
        return this;
      }
      var index = this._callbacks.length;

      this._callbacks.push({
        callback: callback,
        context: context
      });

      (!index || this._getProgress(index - 1) & 1 << index - 1) && setTimeout(function() {
        this._fireCallback(index)
      }.bind(this), 1);

      return this;
    };

    this.onEnd = function(callback, context) {
      if (this._done) {
        callback.call(context, this._value, this);
        return;
      }
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

    //DEBUG PURPOSES ONLY
    this.showProgress = function() {
      if (this._progress == null) {
        console.log("trying to show progress of an already ended progress");
        console.log(this._instanceID);
        return;
      }
      var popCount = this._progress.reduce(function(_popCount, progress, index) {
        console.log("index: " + index + ", progress: " + progress.toString(2));
        return _popCount + progress.popCount();
      }.bind(this), 0);
      console.log(popCount + "/" + this._callbacks.length);
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
      if (this._done) {
        return;
      }
      this._value = value;
      this._setProgressFinished(index);
      this._fireCallback(index + 1);
    };

    this._fireEndEvent = function() {
      var cb = this._onEndEventCallback;
      cb && cb.callback.call(cb.context, this._value);
    };

    this._cleanUp = function() {
      this._done = true;
      this._callbacks = null;
      this._progress = null;
      this._onEndEventCallback = null;
    };

    this._getProgress = function(index) {
      var progressIndex = this._getProgressIndex(index);
      this._progress[progressIndex] = this._progress[progressIndex] || 0;
      return this._progress[progressIndex];
    };

    this._getProgressIndex = function(index) {
      return Math.floor(index / 32);
    };

    this._setProgressFinished = function(index) {
      if (this._progress == null) {
        return;
      }
      var progressIndex = this._getProgressIndex(index);
      this._progress[progressIndex] |= 1 << index;
    };
  };

  if (module) {
    module.exports.createTracker = progressHandler.createTracker;
    module.exports.createSequence = progressHandler.createSequence;
  } else {
    ccssl.progressHandler = progressHandler;
  }
})();
