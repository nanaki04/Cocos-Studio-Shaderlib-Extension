ccssl.ProjectMenuItems.Load = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "load");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    this._loadMenu = new ccssl.Menu().init(
      { x: 150, y: 75 },
      { width: 150, height: 50 },
      "project_load_menu",
      true
    );

    return this;
  },

  _onSelectCallback: function(menuItem) {
    ccssl.menuSelectionHandler.pause();
    this._getProjectList(function(projectList) {
      ccssl.menuSelectionHandler.resume();
      this._populateProjectLoadMenu(projectList);
      this._loadMenu.show();
    }.bind(this));
  },

  _onDeselectCallback: function(menuItem) {
    this._loadMenu.removeAllMenuItems();
    this._loadMenu.hide();
  },

  _getProjectList: function(collectData) {
    ccssl.communicator.get(ccssl.paths.projects, function(response) {
      collectData(response.projects);
    });
  },

  _populateProjectLoadMenu: function(projectList) {
    projectList.forEach(function(project) {
      var menuItem = new ccssl.MenuItem().init(project);
      menuItem.addOnSelectEventListener(this._loadProject, this);
      this._loadMenu.addMenuItem(menuItem);
    }.bind(this));
  },

  _loadProject: function(menuItem) {
    ccssl.menuSelectionHandler.pause();
    ccssl.progressHandler.createSequence()
      .add(function(empty, done) {
        var data = {
          type: "load",
          project: menuItem.getName()
        };
        ccssl.communicator.post(ccssl.paths.projects, data, function(response) {
          done();
        }.bind(this));
      })
      .add(function(empty, done) {
        ccssl.componentHandler.reloadAll(done);
      })
      .onEnd(function() {
        ccssl.menuSelectionHandler.resume();
        ccssl.menuSelectionHandler.deselectAll();
      });
  }
});