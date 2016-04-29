ccsl.lightSourceHandler = {
  _lightSourceGroups: {
    "default": []
  },

  registerLightSource: function(lightSource) {
    var group = this._getLightSourceGroup(lightSource);
    if (group.indexOf(lightSource) !== -1) {
      return true;
    }
    group.push(lightSource);
    return true;
  },

  removeLightSource: function(lightSource) {
    var group = this._getLightSourceGroup(lightSource);
    var length = group.length;
    for (var x = 0; x < length; x++) {
      if (group[x] === lightSource) {
        delete group.splice(x, 1);
        break;
      }
    }
  },

  getLightSourcesByGroup: function(groupName) {
    var group = this._lightSourceGroups[groupName];
    if (!group || !group.length) {
      return [];
    }
    var length = group.length;
    for (var x = 0; x < length; x++) {
      if (group[x].getParent() == null) {
        group[x].unregisterSelf();
      }
    }
    return group;
  },

  updateLightSourceGroup: function(lightSource, oldGroupName) {
    var _oldGroupName = oldGroupName || this._searchLightSourceGroup(lightSource);
    var oldGroup = this._lightSourceGroups[_oldGroupName];
    oldGroup.splice(oldGroup.indexOf(lightSource), 1);
    this.registerLightSource(lightSource);
  },

  reportLightSourceAttributeChanges: function(lightSource) {
    var group = this._getLightSourceGroup(lightSource);
  },

  clearCache: function() {
    this._lightSourceGroups = {
      "default": []
    }
  },

  _getLightSourceGroup: function(lightSource) {
    var groupName = lightSource.getLightSourceGroup();
    if (groupName == null) {
      return [];
    }
    this._lightSourceGroups[groupName] = this._lightSourceGroups[groupName] || [];
    return this._lightSourceGroups[groupName];
  },

  _searchLightSourceGroup: function(lightSource) {
    var keys = Object.keys(this._lightSourceGroups);
    var length = keys.length;
    for (var x = 0; x < length; x++) {
      if (this._lightSourceGroups[keys[x]].indexOf(lightSource) !== -1) {
        return keys[x];
      }
    }
    return "";
  }

};