ccssl.cache = ccssl.cache || {};

ccssl.cache.materials = {
  _materials: null,

  get: function(collectMaterials) {
    if (this._materials) {
      collectMaterials(this._materials);
      return;
    }
    this.refresh(function(materials) {
      collectMaterials(materials);
    });
  },

  refresh: function(collectMaterials) {
    ccssl.communicator.get(ccssl.paths.materials, function(materials) {
      this._materials = materials;
      collectMaterials(materials);
    }.bind(this));
  },

  getMaterial: function(id, collectMaterial) {
    if (this._materials && this._materials[id]) {
      collectMaterial(this._materials[id]);
      return;
    }
    this.refresh(function(materials) {
      collectMaterial(materials[id]);
    });
  },

  getActiveMaterials: function(collectActiveMaterials) {
    var tracker = ccssl.progressHandler.createTracker([]);
    var sequence = ccssl.progressHandler.createSequence();

    sequence.add(function(empty, collectActiveMaterialIds) {
      ccssl.cache.materialNodes.getActiveMaterialIds(collectActiveMaterialIds);
    }).onEnd(function(activeMaterialIds) {

      activeMaterialIds.forEach(function(activeMaterialId) {

        tracker.add(function(activeMaterials, done) {
          this.getMaterial(activeMaterialId, function(activeMaterial) {
            activeMaterials.push(activeMaterial);
            done(activeMaterials);
          });
        }.bind(this));

      }.bind(this));

      tracker.onEnd(collectActiveMaterials);
      tracker.forceUpdate();

    }.bind(this));
  },

  update: function(material, done) {
    if (this._materials) {
      this._update(material, done);
      return;
    }
    this.refresh(function() {
      this._update(material, done);
    }.bind(this));
  },

  _update: function(material, done) {
    this._materials[material.id] = material;
    ccssl.communicator.post(ccssl.paths.action, {
      action: "updateMaterial",
      actionParameters: {
        material: material
      }
    }, function(response) {
      //todo rollback cache on error
      done && done();
    });
  },

  clear: function() {
    this._materials = null;
  }
};
