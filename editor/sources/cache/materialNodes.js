ccssl.cache = ccssl.cache || {};

ccssl.cache.materialNodes = {
  _materialNodes: null,

  get: function(collectMaterialNodes) {
    if (this._materialNodes) {
      collectMaterialNodes(this._materialNodes);
      return;
    }
    this.refresh(function(materialNodes) {
      collectMaterialNodes(materialNodes);
    });
  },

  refresh: function(collectMaterialNodes) {
    ccssl.communicator.get(ccssl.paths.material_nodes, function(materialNodes) {
      this._materialNodes = materialNodes;
      collectMaterialNodes(materialNodes);
    }.bind(this));
  },

  getMaterialNodes: function(id, collectMaterialNodes) {
    if (this._materialNodes && this._materialNodes[id]) {
      collectMaterialNodes(this._materialNodes[id]);
      return;
    }
    this.refresh(function(materialNodes) {
      collectMaterialNodes(materialNodes[id]);
    });
  },

  getActiveMaterialIds: function(collectActiveMaterialIds) {
    this.get(function(materialNodes) {
      var keys = Object.keys(materialNodes);
      var activeMaterialIds = keys.reduce(function(activeMaterialIds, key) {
        if (materialNodes[key].length) {
          activeMaterialIds.push(key);
        }
        return activeMaterialIds;
      }, []);
      collectActiveMaterialIds(activeMaterialIds);
    });
  },

  update: function(materialId, selectionType, done) {
    if (this._materialNodes) {
      this._update(materialId, selectionType, done);
      return;
    }
    this.refresh(function() {
      this._update(materialId, selectionType, done);
    }.bind(this));
  },

  _update: function(materialId, selectionType, done) {
    ccssl.progressHandler.createTracker()
      .add(function(empty, _done) {
        ccssl.nodeSelection.get(function(currentSelection) {
          this._materialNodes[materialId] = (this._materialNodes[materialId] || []).concat(currentSelection);
          _done();
        }.bind(this), selectionType);
      })
      .add(function(empty, _done) {
        ccssl.communicator.post(ccssl.paths.action, {
          action: "applyMaterial",
          actionParameters: {
            materialId: this._material.id,
            selection: selectionType
          }
        }, function(response) {
          //todo rollback cache on error
          _done();
        });
      })
      .onEnd(done);
  },

  clear: function() {
    this._materialNodes = null;
  }
};
