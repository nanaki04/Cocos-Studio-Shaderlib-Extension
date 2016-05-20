(function() {
  var base = require('./action');
  var selectionHandler = require('../data/selectionHandler');

  var selectNode = base.extend({
    _actionName: "selectNode",

    run: function(done) {
      this._completed = true;
      selectionHandler.addToCurrentSelection(this._parameters.nodes, done);
    },

    revert: function(done) {
      this._completed = false;
      selectionHandler.removeFromCurrentSelection(this._parameters.nodes, done);
    }
  });

  module.exports.create = selectNode;
})();