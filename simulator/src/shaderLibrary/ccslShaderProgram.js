ccsl.ShaderProgram = cc.Node.extend({
  SHADER_TYPES: {
    VERTEX: 0,
    FRAGMENT: 1
  },

  //override when extending this class, and call inherit during the initialize phase
  PATHS: {},
  ATTRIBUTES: [],
  UNIFORMS: {},
  DEPENDENT_SHADER: "",

  ctor: function() {
    this._super();
    this._eventListeners = [];
  },

  initialize: function(vertexShaderFile, fragmentShaderFile, attributes, callback) {
    var vertexShaderSource = vertexShaderFile ? cc.loader.getRes(vertexShaderFile) : null;
    var fragmentShaderSource = fragmentShaderFile ? cc.loader.getRes(fragmentShaderFile) : null;
    if ((vertexShaderFile != null && vertexShaderSource == null) || (fragmentShaderFile != null && fragmentShaderSource == null)) {
      this._initWithLoad(vertexShaderFile, fragmentShaderFile, attributes, callback);
      return;
    }
    this._initialize(vertexShaderFile, fragmentShaderFile, attributes, callback);
  },

  inherit: function(callback) {
    var onDependentInitCallback = function(_callback, _dependent) {
      var mergeDependent = function(__callback, __dependent) {
        this.merge(__dependent);
        __callback(this);
      };

      ccsl.ShaderProgram.prototype.initialize.call(this, this.PATHS.VERTEX_SHADER_SOURCE, this.PATHS.FRAGMENT_SHADER_SOURCE, this.ATTRIBUTES, mergeDependent.bind(this, _callback, _dependent));
    };

    var dependentShader = new ccsl[this.DEPENDENT_SHADER]();
    dependentShader.initialize(onDependentInitCallback.bind(this, callback, dependentShader));
  },

  _initWithLoad: function(vertexShaderFile, fragmentShaderFile, attributes, callback) {
    var toLoad = [];
    if (vertexShaderFile) toLoad.push(vertexShaderFile);
    if (fragmentShaderFile) toLoad.push(fragmentShaderFile);
    cc.loader.load(toLoad, function() {
      this._initialize(vertexShaderFile, fragmentShaderFile, attributes, callback);
    }, this);
  },

  _initialize: function(vertexShaderFile, fragmentShaderFile, attributes, callback) {
    this._shaderProgram = new cc.GLProgram();
    this._getSourceFromShaderFile(vertexShaderFile, this.SHADER_TYPES.VERTEX);
    this._getSourceFromShaderFile(fragmentShaderFile, this.SHADER_TYPES.FRAGMENT);
    this._cacheAttributes(attributes);
    callback(this);
  },

  onEnter: function() {
    this.fireEvent("onEnter", this);
    ccsl.shaderProgramHandler.registerProgram(this);
    cc.Node.prototype.onEnter.apply(this, arguments);
    this._shaderProgram.initWithString(this._vertexShaderSource, this._fragmentShaderSource);
    this.addAttributes();
    this.link();
    this.updateUniforms();
    this.getParent().setShaderProgram(this._shaderProgram);
  },

  onExit: function() {
    this.fireEvent("onExit", this);
    ccsl.shaderProgramHandler.removeProgram(this);
    cc.Node.prototype.onExit.apply(this, arguments);
  },

  addEventListener: function(type, callback, context) {
    this._eventListeners[type] = this._eventListeners[type] || [];
    var eventListener = {
      callback: callback,
      context: context
    };
    this._eventListeners[type].push(eventListener);

    return eventListener;
  },

  addEventListenerOnce: function(type, callback, context) {
    var eventListener = this.addEventListener(type, callback, context);
    eventListener.once = true;
  },

  fireEvent: function(type, args) {
    if (!this._eventListeners[type]) {
      return [];
    }
    var toRemove = [];
    this._eventListeners[type].forEach(function(eventListener) {
      if (eventListener.once) {
        toRemove.push(eventListener);
      }
      eventListener.callback.apply(eventListener.context, args);
    });
    toRemove.forEach(function(eventListener) {
      this.removeEventListener(type, eventListener);
    }.bind(this));
  },

  removeEventListener: function(type, eventListener) {
    var index = this._eventListeners[type].indexOf(eventListener);
    if (~index)
      this._eventListeners[type].splice(index, 1);
  },

  removeEventListeners: function(type) {
    this._eventListeners[type] = [];
  },

  removeAllEventListeners: function() {
    this._eventListeners = [];
  },

  addShaderAttributes: function(shader, attributes) {
    var _shader = shader || new cc.GLProgram();
    var _attributes = attributes || this.DEFAULT_SPRITE_SHADER_ATTRIBUTES;

    _attributes.forEach(function(attributePair) {
      _shader.addAttribute.apply(_shader, attributePair);
    });

    return _shader;
  },

  getVertexShaderSource: function() {
    return this._vertexShaderSource;
  },

  getFragmentShaderSource: function() {
    return this._fragmentShaderSource;
  },

  getAttributes: function() {
    return this._attributes || [];
  },

  _getSourceFromShaderFile: function(file, type) {
    var loc = type === this.SHADER_TYPES.VERTEX ? "_vertexShaderSource" : "_fragmentShaderSource";
    if (!file) {
      this[loc] = this[loc] || "";
      return false;
    }
    this[loc] = cc.loader.getRes(file) || this[loc];
    return this[loc] != null;
  },

  _cacheAttributes: function(attributes) {
    this._attributes = attributes || this._attributes;
  },

  addAttributes: function() {
    var shaderProgram = this._shaderProgram;
    this._attributes.forEach(function(attributePair) {
      shaderProgram.addAttribute.apply(shaderProgram, attributePair);
    });
  },

  link: function() {
    if (this._shaderProgram == null) {
      return false;
    }
    this._shaderProgram.link();
    return true;
  },

  updateUniforms: function() {
    if (this._shaderProgram == null) {
      return false;
    }
    this._shaderProgram.updateUniforms();
    this._updateCustomUniforms();
    return true;
  },

  _updateCustomUniforms: function() {
    var keys = Object.keys(this.UNIFORMS);
    keys.forEach(function(name) {
      this._addCustomUniform(name, this.UNIFORMS[name].type, this.UNIFORMS[name].value);
    }, this);
  },

  _addCustomUniform: function(name, type, value) {
    var loc = this._shaderProgram.getUniformLocationForName(name);
    var args;
    if (Array.isArray(value)) {
      args = value.slice();
      args.unshift(loc);
    } else {
      args = [loc, value];
    }
    this._shaderProgram["setUniformLocationWith" + type].apply(this._shaderProgram, args);
  },

  setCustomUniformValue: function(name, value) {
    this.UNIFORMS[name].value = value;
  },

  setCustomUniformValues: function(uniformValues) {
    var keys = Object.keys(uniformValues);
    keys.forEach(function(key) {
      this.setCustomUniformValue(key, uniformValues[key]);
    }.bind(this));
  },

  merge: function(ccslShaderProgram) {
    var vertexVariableSections = [];
    var vertexMainSections = [];
    var fragmentVariableSections = [];
    var fragmentMainSections = [];
    this._splitShaderSource(ccslShaderProgram.getVertexShaderSource() || "", vertexVariableSections, vertexMainSections);
    this._splitShaderSource(ccslShaderProgram.getFragmentShaderSource() || "", fragmentVariableSections, fragmentMainSections);
    this._splitShaderSource(this.getVertexShaderSource() || "", vertexVariableSections, vertexMainSections);
    this._splitShaderSource(this.getFragmentShaderSource() || "", fragmentVariableSections, fragmentMainSections);

    this._vertexShaderSource = this._combineShaderSources(vertexVariableSections, vertexMainSections);
    this._fragmentShaderSource = this._combineShaderSources(fragmentVariableSections, fragmentMainSections);
    this._attributes = ccslShaderProgram.getAttributes().concat(this._attributes);

    return true;
  },

  _splitShaderSource: function(source, variableContainer, mainContainer) {
    if (!source) {
      return false;
    }
    var split = source.split("void main()");
    if (split.length < 2) {
      variableContainer.push(split[0]);
      mainContainer.push("");
      return;
    }
    variableContainer.push(split[0]);
    mainContainer.push(split[1].slice(split[1].search("{") + 1, split[1].lastIndexOf("}") - 1));
    return true;
  },

  _combineShaderSources: function(variableSections, mainSections) {
    var newSource = "";
    variableSections.forEach(function(variableSection) {
      newSource += variableSection;
    });
    newSource += "\n void main() \n { \n";
    mainSections.forEach(function(mainSection) {
      newSource += mainSection;
    });
    newSource += "\n } \n";

    return newSource;
  }
});