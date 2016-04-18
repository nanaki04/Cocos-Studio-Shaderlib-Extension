ccsl.shaderProgramHandler = {
  _shaderPrograms: {},

  registerProgram: function(ccslShaderProgram) {
    if (ccslShaderProgram == null) {
      ccsl.debugger.log("ccsl.shaderProgramHandler: no valid shader program passed.");
      return;
    }

    var parent = ccslShaderProgram.getParent();
    if (parent == null) {
      ccsl.debugger.log("ccsl.shaderProgramHandler: shaderProgram not yet added to a node, aborting registration.");
      return;
    }

    var id = parent.__instanceId;
    if (this._shaderPrograms[id] && this._shaderPrograms[id] !== ccslShaderProgram) {
      ccsl.debugger.log("ccsl.shaderProgramHandler: overwriting shaderProgram previously added to node, and cleaning up old program");
      this._shaderPrograms[id].getParent() && this._shaderPrograms[id].removeFromParent();
    }

    this._shaderPrograms[id] = ccslShaderProgram;
  },

  removeProgram: function(ccslShaderProgram) {
    if (ccslShaderProgram == null) {
      ccsl.debugger.log("ccsl.shaderProgramHandler: no valid shader program passed.");
      return;
    }

    if (this._removeProgramByParent(ccslShaderProgram.getParent())) {
      return;
    }

    this._removeProgram(ccslShaderProgram);
  },

  getShaderProgramByNode: function(ccNode) {
    return this._shaderPrograms[ccNode.__instanceId];
  },

  clearCache: function() {
    this._shaderPrograms = {};
  },

  _removeProgramByParent: function(parent) {
    if (parent == null) {
      return false;
    }

    var program = this._shaderPrograms[parent.__instanceId];
    if (program == null) {
      return false;
    }

    this._shaderPrograms[parent.__instanceId] = null;
    program.removeFromParent();

    return true;
  },

  _removeProgram: function(program) {
    var keys = Object.keys(this._shaderPrograms);
    var length = keys.length;
    for (var x = 0; x < length; x++) {
      if (this._shaderPrograms[keys[x]] === program) {
        delete this._shaderPrograms[keys[x]];
        break;
      }
    }
  }
};