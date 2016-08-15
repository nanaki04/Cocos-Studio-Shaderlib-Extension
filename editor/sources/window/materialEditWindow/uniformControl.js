ccssl.UniformControl = ccssl.Class.define({
  init: function(uniformName, uniformData) {
    this._uniformName = uniformName;
    this._type = uniformData.type;
    this._value = uniformData.value;

    return this;
  },

  _getValueLength: function() {
    if (!this._value.length) {
      return 1;
    }
    return this._value.length;
  },

  generateElement: function() {
    var root = document.createElement("div");
    var namePlate = document.createElement("div");
    var inputBoxes = [];
    for (var x = 0; x < this._getValueLength(); x++) {
      inputBoxes[x] = document.createElement("input");
      inputBoxes[x].type = "text";
      inputBoxes[x].className = "textbox margin";
    }
    //uniform name
    //numeric box * float option count
  }
});
