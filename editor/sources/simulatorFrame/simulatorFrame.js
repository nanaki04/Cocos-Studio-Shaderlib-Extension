ccssl.SimulatorFrame = ccssl.Class.define({
  init: function() {
    this._initOnSimulatorLoadCallback();
    this.reload();

    return this;
  },

  setRect: function(rect) {
    this.setPos({x: rect.x, y: rect.y});
    this.setSize({width: rect.width, height: rect.height});
  },

  getRect: function() {
    return {
      x: this._pos.x,
      y: this._pos.y,
      width: this._size.width,
      height: this._size.height
    }
  },

  setPos: function(pos) {
    this._pos = pos;
  },

  getPos: function() {
    return this._pos;
  },

  setSize: function(size) {
    this._size = size;
  },

  getSize: function() {
    return this._size;
  },

  redraw: function() {
    var element = this.getElement();
    element.style.top = this._pos.y + "px";
    element.style.left = this._pos.x + "px";
    element.style.width = Math.max((this._size.width - 5), 0) + "px";
    element.style.height = this._size.height + "px";
  },

  reload: function(done) {
    this.getElement().src = ccssl.paths.simulator;
    done && done();
  },

  getElement: function() {
    return this._element || document.getElementById("simulator");
  },

  _initOnSimulatorLoadCallback: function() {
    ccssl.receiver.addOnLoadCallback(this._applyMaterials, this);
  },

  _applyMaterials: function() {
    ccssl.progressHandler.createTracker({})
      .add(function(materialData, collectMaterialData) {
        ccssl.communicator.get(ccssl.paths.material_nodes, function(materialNodes) {
          materialData.nodes = materialNodes;
          collectMaterialData(materialData);
        });
      })
      .add(function(materialData, collectMaterialData) {
        ccssl.communicator.get(ccssl.paths.materials, function(materials) {
          materialData.materials = materials;
          collectMaterialData(materialData);
        });
      })
      .onEnd(function(materialData) {
        var ids = Object.keys(materialData.nodes);
        ids.forEach(function(id) {
          if (!materialData.nodes[id].length || !materialData.materials[id]) {
            return;
          }
          ccssl.messageDispatcher.postMessage({
            message: "applyMaterial",
            material: materialData.materials[id],
            selection: materialData.nodes[id]
          });
        });
      });
  }
});
