ccssl.menuSelectionHandler = {
  init: function() {
    this._selections = {};
    document.body.addEventListener("click", this.deselectAll.bind(this));
  },

  select: function(menuItem, group) {
    if (this._paused) {
      return;
    }
    this.deselect(group);
    this._selections[group] = menuItem;
  },

  deselect: function(group) {
    if (this._paused) {
      return;
    }
    this._selections[group] && this._selections[group].deselect();
  },

  clear: function(group) {
    this._selections[group] = null;
  },

  pause: function() {
    this._paused = true;
  },

  resume: function() {
    this._paused = false;
  },

  deselectAll: function() {
    if (this._paused) {
      return;
    }
    var selections = this._selections;
    var groupNames = Object.keys(selections);
    groupNames.forEach(function(groupName) {
      selections[groupName] && selections[groupName].deselect();
      selections[groupName] = null;
    });
  }
};