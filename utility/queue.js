(function() {
  var progressHandler = module ? require('./progressHandler') : ccssl.progressHandler;

  var queue = function(callbackValue) {
    this._onSequenceEnd = function() {
      this._sequence = progressHandler.createSequence(callbackValue);
      this._sequence.onEnd(this._onSequenceEnd, this);
    };

    this._sequence = progressHandler.createSequence(callbackValue);
    this._sequence.onEnd(this._onSequenceEnd, this);

    this.enqueue = function(callback, context) {
      this._sequence.add(callback, context);
    };

    this.remove = function() {
      console.log("removing queue: " + this._id);
      this._sequence.onEnd(function() {});
      this._sequence.forceEnd();
      this._sequence = null;
    };
  };

  if (module) {
    module.exports.Queue = queue;
  } else {
    ccssl.Queue = queue;
  }
})();
