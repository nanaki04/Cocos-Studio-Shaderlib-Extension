ccssl.UniformControlCollection = ccssl.Class.define({
  init: function() {
    this._element = this._createElement();
    this._controls = [];

    return this;
  },

  getElement: function() {
    return this._element;
  },

  addControl: function(uniformControl) {
    this._controls.push(uniformControl);
    this.getElement().appendChild(uniformControl.getElement());
  },

  removeAllControls: function() {
    this._controls.forEach(function(control) {
      control.remove();
    });
    this._controls = [];
  },

  getValues: function() {
    return this._controls.reduce(function(values, control) {
      values[control.getName()] = control.getValue();
      return values;
    }, {});
  },

  _createElement: function() {
    var element = document.createElement("div");

    return element;
  }
});
