ccsl.UniformFrame = ccs.Frame.extend({
  ctor: function () {
    ccs.Frame.prototype.ctor.call(this);
  },

  onEnter: function (nextFrame) {
    this._updateUniform(this._value);
    this._betweenValue = this._getBetweenValue(this._value, nextFrame.getValue());
  },

  apply: function(percent) {
    if (!this._tween) {
      return;
    }
    if (!this._value.map) {
      this._updateUniform(this._value + this._betweenValue * percent);
      return;
    }
    var values = this._value.map(function(value, index) {
      return value + this._betweenValue[index] * percent;
    }.bind(this));
    this._updateUniform(values);
  },

  _updateUniform: function(value) {
    this._shaderProgram.setCustomUniformValue(this._uniformKey, value);
  },

  _getBetweenValue: function(prevValue, nextValue) {
    if (!prevValue.map) {
      return nextValue - prevValue;
    }
    return prevValue.map(function(value, index) {
      return nextValue[index] - prevValue;
    });
  },

  setUniformKey: function (key) {
    this._uniformKey = key;
  },

  getUniformKey: function () {
    return this._uniformKey;
  },

  setValue: function (value) {
    this._value = value;
  },

  getValue: function() {
    return this._value;
  },

  setShaderProgram: function(shaderProgram) {
    this._shaderProgram = shaderProgram;
  },

  getShaderProgram: function() {
    return this._shaderProgram;
  }
});
