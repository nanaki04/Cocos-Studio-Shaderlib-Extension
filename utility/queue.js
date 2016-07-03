(function() {
  var progressHandler = module ? require('./progressHandler') : ccssl.progressHandler;

  var ID = 0;

  var generateID = function() {
    return ID++;
  };

  var queue = function(callbackValue) {
    this._onSequenceEnd = function() {
      //console.log("utility/queue.js.queue");
      //console.log("end");
      //console.log(this._sequence._instanceID);
      //this._sequence.showProgress();
      //console.log("______________________");
      this._sequence = progressHandler.createSequence(callbackValue);
      //this._sequence._instanceID = generateID();
      this._sequence.onEnd(this._onSequenceEnd, this);
    };

    this._sequence = progressHandler.createSequence(callbackValue);
    //this._sequence._instanceID = generateID();
    this._sequence.onEnd(this._onSequenceEnd, this);

    this.enqueue = function(callback, context) {
      //console.log("utility/queue.js.queue");
      //console.log("enqueue");
      //console.log(this._sequence._instanceID);
      //this._sequence.showProgress();
      //console.log("______________________");
      this._sequence.add(callback, context);
    };

    this.remove = function() {
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
