(function() {
  var fs = require('fs');
  var actionData = require('./actionData');

  var id = 0;
  var _actionTypes = [
    "SHADER_EFFECT",
    "LIGHT_SOURCE"
  ];
  var ACTION_TYPES = _actionTypes.reduce(function(AT, actionType) {
    AT.CREATE[actionType] = id++;
    AT.UPDATE[actionType] = id++;
    AT.DELETE[actionType] = id++;
  }, {
    CREATE: {},
    UPDATE: {},
    DELETE: {}
  });

  var action = function(actionType, sharedData, preData, postData) {
    this.actionType = actionType;
    this.actionData = actionData.createActionData(sharedData, preData, postData);
    this.applyAction = function() {};
    this.revertAction = function() {};
  };

  module.exports.ACTION_TYPES = ACTION_TYPES;
  module.exports.createAction = function(actionType, sharedData, preData, postData) {
    return new action(actionType, sharedData, preData, postData);
  };
  module.exports.extendAction = function(definitions) {
    var newAction = function() {};
    newAction.prototype = action.prototype;
  };
})();
