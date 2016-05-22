(function() {
  var actionData = function(sharedData, preData, postData) {
    this.sharedData = sharedData;
    this.preData = preData;
    this.postData = postData;
  };

  module.exports.createActionData = function(sharedData, preData, postData) {
    return new actionData(sharedData, preData, postData);
  };
})();
