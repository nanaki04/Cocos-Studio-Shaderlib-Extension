ccssl.UniformControl = ccssl.Class.define({
  init: function(uniformName, uniformDefinition) {
    this._inputCollection = [];
    this._eventCleaners = [];
    this._createElement(uniformName);
    this._parseUniformDefinition(uniformDefinition);

    return this;
  },

  _parseUniformDefinition: function(uniformDefinition) {
    var length = parseInt(uniformDefinition.type);
    for (var x = 0; x < length; x++) {
      if (uniformDefinition.min != null && uniformDefinition.max != null && length === 1) {
        this._inputCollection.push(this._createFloatSlider(uniformDefinition.min, uniformDefinition.max));
      } else if (uniformDefinition.min != null && uniformDefinition.max != null) {
        var min = (typeof uniformDefinition.min === "number") ? uniformDefinition.min : uniformDefinition.min[x];
        var max = (typeof uniformDefinition.max === "number") ? uniformDefinition.max : uniformDefinition.max[x];
        this._inputCollection.push(this._createLimitedFloatInput(min, max));
      }else {
        this._inputCollection.push(this._createFloatInput());
      }
    }
  },

  setParent: function(parent) {
    parent.getElement().appendChild(this.getElement());
  },

  remove: function() {
    this._eventCleaners.forEach(function(eventCleaner) {
      eventCleaner();
    });
    this._eventCleaners = null;
    this._element.parentNode.removeChild(this._element);
  },

  getElement: function() {
    return this._element;
  },

  _createElement: function(uniformName) {
    var rootElement = document.createElement("div");
    var nameLabel = document.createElement("div");
    var inputCollection = document.createElement("div");

    nameLabel.innerHTML = uniformName;

    rootElement.appendChild(nameLabel);
    rootElement.appendChild(inputCollection);

    this._element = rootElement;
    this._nameLabel = nameLabel;
    this._inputCollectionElement = inputCollection;
  },

  _createFloatInput: function() {
    var input = document.createElement("input");
    input.type = "number";
    this._inputCollectionElement.appendChild(input);

    return input;
  },

  _createLimitedFloatInput: function(min, max) {
    var input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    this._inputCollectionElement.appendChild(input);

    return input;
  },

  _createFloatSlider: function(min, max) {
    var slider = document.createElement("input");
    slider.type = "range";
    slider.step = 0.1;
    slider.min = min;
    slider.max = max;
    this._inputCollectionElement.appendChild(slider);

    var input = this._createLimitedFloatInput(min, max);

    slider.oninput = function() {
      input.value = this.value;
    };

    input.onchange = function() {
      slider.value = this.value;
    };

    this._eventCleaners.push(function() {
      slider.oninput = null;
      input.onchange = null;
    });

    return slider;
  }
});
