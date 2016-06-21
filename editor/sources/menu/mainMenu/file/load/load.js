ccssl.FileMenuItems.Load = ccssl.MenuItem.extend({
  init: function() {
    ccssl.MenuItem.prototype.init.call(this, "load");
    this.addOnSelectEventListener(this._onSelectCallback, this);
    this.addOnDeselectEventListener(this._onDeselectCallback, this);

    this._loadMenu = new ccssl.Menu().init(
      { x: 300, y: 75 },
      { width: 450, height: 50 },
      "project_load_menu",
      true
    );

    return this;
  },

  _onSelectCallback: function(menuItem) {
    ccssl.menuSelectionHandler.pause();
    this._getFileList(function(fileList) {
      ccssl.menuSelectionHandler.resume();
      this._populateFileLoadMenu(fileList);
      this._loadMenu.show();
    }.bind(this));
  },

  _onDeselectCallback: function(menuItem) {
    this._loadMenu.removeAllMenuItems();
    this._loadMenu.hide();
  },

  _getFileList: function(collectData) {
    ccssl.communicator.get(ccssl.paths.files, function(fileList) {
      collectData(fileList.jsonList);
    });
  },

  _populateFileLoadMenu: function(fileList) {
    fileList.forEach(function(file) {
      var menuItem = new ccssl.MenuItem().init(file, 45);
      menuItem.addOnSelectEventListener(this._loadFile, this);
      this._loadMenu.addMenuItem(menuItem);
    }.bind(this));
  },

  _loadFile: function(menuItem) {
    var sequence = ccssl.progressHandler.createSequence();
    ccssl.menuSelectionHandler.pause();
    sequence.add(function(empty, collectResponse) {
      ccssl.communicator.post(ccssl.paths.files, { path: menuItem.getName() }, function(response) {
        document.getElementById("simulator").src = ccssl.paths.simulator;
        collectResponse(response);
      });
    });
    sequence.add(function(response, done) {
      ccssl.communicator.get(ccssl.paths.nodes, function(nodeInfo) {
        var nodeWindow = ccssl.compositionHandler.getRegisteredElementByType(ccssl.compositionHandler.ELEMENT_TYPES.NODE_WINDOW);
        if (!nodeWindow) {
          return;
        }
        nodeWindow.drawNodes(nodeInfo);
        done();
      });
    });
    sequence.onEnd(function() {
      ccssl.menuSelectionHandler.resume();
      ccssl.menuSelectionHandler.deselectAll();
    });
  }
});