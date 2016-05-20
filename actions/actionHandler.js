(function() {
  var fs = require('fs');
  var projectHandler = require('../data/projectHandler');
  var fileHandler = require("../data/fileHandler");
  var progressHandler = require("../utility/progressHandler");

  var actions = {
    selectNode: require('./selectNode'),
    deselectNode: require('./deselectNode')
  };

  var handleAction = function(actionName, parameters, done) {
    console.log(actionName);
    console.log(parameters);
    var action = _createAction(actionName, parameters);
    console.log(action);
    progressHandler.createTracker([action])
      .add(_updateHistoryDataSave)
      .add(_executeActionsRun)
      .onEnd(done);
  };

  var undoActions = function(actionDataList, done) {
    var actions = actionDataList.reduce(function(_actions, actionData) {
      actions.unshift(_restoreActionFromActionData(actionData));
      return _actions;
    }, []);
    progressHandler.createTracker(actions)
      .add(_updateHistoryDataUndo)
      .add(_executeActionsRevert)
      .onEnd(done);
  };

  var redoActions = function(actionDataList, done) {
    var actions = actionDataList.reduce(function(_actions, actionData) {
      actions.unshift(_restoreActionFromActionData(actionData));
      return _actions;
    }, []);
    progressHandler.createTracker(actions)
      .add(_updateHistoryDataRedo)
      .add(_executeActionsRun)
      .onEnd(done);
  };

  var deleteActions = function(actionDataList, done) {
    var actions = actionDataList.map(function(actionData) {
      return _restoreActionFromActionData(actionData);
    });
    _updateHistoryDataDelete(actions, done);
  };

  var getHistoryLimit = function() {
    //todo
    return 10;
  };

  var getCurrentHistoryFile = function(collectFileData) {
    fileHandler.getCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.HISTORY, collectFileData);
  };

  var updateHistoryFile = function(data, done) {
    fileHandler.updateCurrentlyLoadedFileData(fileHandler.FILE_DATA_TYPES.HISTORY, data, done);
  };

  var _createAction = function(actionName, parameters) {
    var actionDefinition = actions[actionName];
    if (!actionDefinition) {
      return null;
    }
    return new actionDefinition.create().init(parameters);
  };

  var _restoreActionFromActionData = function(actionData) {
    var action = _createAction(actionData.actionName, actionData.parameters);
    action.setCompleted(actionData.completed);
    action.setId(actionData.id);
    return action;
  };

  var _generateActionId = function(history) {
    if (!history.length) {
      return 1;
    }
    return history[history.length - 1].id + 1;
  };

  var _executeActionsRevert = function(actions, done) {
    if (!actions || !actions.length) {
      return done();
    }
    var sequence = progressHandler.createSequence();
    actions.forEach(function(action) {
      sequence.add(function(empty, _done) {
        action.revert(_done);
      });
    });
    sequence.onEnd(done);
  };

  var _executeActionsRun = function(actions, done) {
    console.log("_executeActionsRun");
    console.log(actions);
    if (!actions || !actions.length) {
      return done();
    }
    var sequence = progressHandler.createSequence();
    actions.forEach(function(action) {
      sequence.add(function(empty, _done) {
        action.run(_done);
      });
    });
    sequence.onEnd(done);
  };

  var _updateHistoryDataUndo = function(actions, done) {
    progressHandler.createSequence()
      .add(function(empty, collectHistoryData) {
        getCurrentHistoryFile(collectHistoryData);
      })
      .onEnd(function(historyData) {
        historyData = _removeHistoryData("history", historyData, actions);
        historyData = _appendHistoryData("reverted", historyData, actions);
        updateHistoryFile(historyData, done);
      });
  };

  var _updateHistoryDataRedo = function(actions, done) {
    progressHandler.createSequence()
      .add(function(empty, collectHistoryData) {
        getCurrentHistoryFile(collectHistoryData);
      })
      .onEnd(function(historyData) {
        historyData = _removeHistoryData("reverted", historyData, actions);
        historyData = _appendHistoryData("history", historyData, actions);
        updateHistoryFile(historyData, done);
      });
  };

  var _updateHistoryDataSave = function(actions, done) {
    console.log("_updateHistoryDataSave");
    console.log(actions);
    progressHandler.createSequence()
      .add(function(empty, collectHistoryData) {
        getCurrentHistoryFile(collectHistoryData);
      })
      .onEnd(function(historyData) {
        console.log("update history save");
        console.log(historyData);
        historyData = _appendHistoryData("history", historyData, actions);
        console.log(historyData.history);
        historyData = _trimHistory(historyData);
        console.log(historyData.history);
        historyData.reverted = [];
        updateHistoryFile(historyData, done);
      });
  };

  var _updateHistoryDataDelete = function(actions, done) {
    progressHandler.createSequence()
      .add(function(empty, collectHistoryData) {
        getCurrentHistoryFile(collectHistoryData);
      })
      .onEnd(function(historyData) {
        historyData = _removeHistoryData("history", historyData, actions);
        updateHistoryFile(historyData, done);
      });
  };

  var _trimHistory = function(historyData) {
    var limit = getHistoryLimit();
    var length = historyData.history.length;
    if (length > limit) {
      historyData.history.splice(limit, length - limit);
    }
    return historyData;
  };

  var _appendHistoryData = function(type, historyData, actions) {
    historyData[type] = historyData[type] || [];
    actions.forEach(function(action) {
      action.setId(_generateActionId(historyData[type]));
      historyData[type].push(action.toJSON());
    });

    return historyData;
  };

  var _removeHistoryData = function(type, historyData, actions) {
    var history = historyData[type];
    if (!history || !history.length) {
      return historyData;
    }
    history = actions.reduce(function(_history, action) {
      var indices = _history.reduce(function(_indices, historyRecord, index) {
        if (historyRecord.id === action.getId()) {
          indices.unshift(index);
        }
        return _indices;
      }, []);

      indices.forEach(function(index) {
        _history.splice(index, 1);
      });

      return _history;
    }, history);
    historyData[type] = history;
    return historyData;
  };

  module.exports.handleAction = handleAction;
  module.exports.undoActions = undoActions;
  module.exports.redoActions = redoActions;
  module.exports.deleteActions = deleteActions;
  module.exports.getHistoryLimit = getHistoryLimit;
  module.exports.getCurrentHistoryFile = getCurrentHistoryFile;
  module.exports.updateHistoryFile = updateHistoryFile;

})();
