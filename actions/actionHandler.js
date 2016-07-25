(function() {
  var fs = require('fs');
  var projectHandler = require('../data/projectHandler');
  var fileHandler = require("../data/fileHandler");
  var progressHandler = require("../utility/progressHandler");

  var actions = {
    selectNode: require('./selectNode'),
    deselectNode: require('./deselectNode'),
    newMaterial: require('./newMaterial'),
    updateMaterial: require('./updateMaterial'),
    deleteMaterial: require('./deleteMaterial'),
    updateGlobalMaterial: require('./updateGlobalMaterial'),
    deleteGlobalMaterial: require('./deleteGlobalMaterial'),
    applyMaterial: require('./applyMaterial')
  };

  var handleAction = function(actionName, parameters, collectResult) {
    var action = _createAction(actionName, parameters);
    var returnValue = null;
    progressHandler.createTracker([action])
      .add(_updateHistoryDataSave)
      .add(function(actions, done) {
        _executeActionsRun(actions, function(result) {
          returnValue = result;
          done();
        });
      })
      .onEnd(function() {
        collectResult(returnValue);
      });
  };

  var undoActions = function(actionDataList, collectResult) {
    var actions = actionDataList.reduce(function(_actions, actionData) {
      actions.unshift(_restoreActionFromActionData(actionData));
      return _actions;
    }, []);
    var returnValue = null;
    progressHandler.createTracker(actions)
      .add(_updateHistoryDataUndo)
      .add(function(actions, done) {
        _executeActionsRevert(actions, function(result) {
          returnValue = result;
          done();
        });
      })
      .onEnd(function() {
        collectResult(returnValue);
      });
  };

  var redoActions = function(actionDataList, collectResult) {
    var actions = actionDataList.reduce(function(_actions, actionData) {
      actions.unshift(_restoreActionFromActionData(actionData));
      return _actions;
    }, []);
    var returnValue = null;
    progressHandler.createTracker([action])
      .add(_updateHistoryDataSave)
      .add(function(actions, done) {
        _executeActionsRun(actions, function(result) {
          returnValue = result;
          done();
        });
      })
      .onEnd(function() {
        collectResult(returnValue);
      });
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

  var _executeActionsRevert = function(actions, collectResult) {
    if (!actions || !actions.length) {
      return collectResult();
    }
    var sequence = progressHandler.createSequence();
    actions.forEach(function(action) {
      sequence.add(function(empty, _done) {
        action.revert(_done);
      });
    });
    sequence.onEnd(collectResult);
  };

  var _executeActionsRun = function(actions, collectResult) {
    if (!actions || !actions.length) {
      return collectResult();
    }
    var sequence = progressHandler.createSequence();
    actions.forEach(function(action) {
      sequence.add(function(empty, _collectResult) {
        action.run(_collectResult);
      });
    });
    sequence.onEnd(collectResult);
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
    progressHandler.createSequence()
      .add(function(empty, collectHistoryData) {
        getCurrentHistoryFile(collectHistoryData);
      })
      .onEnd(function(historyData) {
        historyData = _appendHistoryData("history", historyData, actions);
        historyData = _trimHistory(historyData);
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
