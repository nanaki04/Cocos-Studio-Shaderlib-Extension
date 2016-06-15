ccssl.MaterialButtonsInterface.Interface = ccssl.Class.define({
  PROPORTIONS: {
    HEIGHT: 50,
    DEFAULT_WIDTH: 500,
    SELECT_BUTTON_WIDTH_PERCENT: 50,
    EDIT_BUTTON_WIDTH_PERCENT: 13,
    COPY_BUTTON_WIDTH_PERCENT: 13,
    DELETE_BUTTON_WIDTH_PERCENT: 13
  },

  init: function(material) {
    this._material = material;
    this._id = material.id;
    this._name = material.name;
    this._element = this._createElement();
    this._selectButton = this._initSelectButton();
    this._editButton = this._initEditButton();
    this._copyButton = this._initCopyButton();
    this._deleteButton = this._initDeleteButton();

    return this;
  },

  setParent: function(parent) {
    this._parent = parent;
  },

  getParent: function() {
    return this._parent;
  },

  getWindow: function() {
    return this.getParent();
  },

  setWidth: function(width) {
    this._width = width;
  },

  redraw: function() {
    var width = this._width || this.PROPORTIONS.DEFAULT_WIDTH;
    var height = this.PROPORTIONS.HEIGHT;
    this._selectButton.setSize({width: width * 0.01 * this.PROPORTIONS.SELECT_BUTTON_WIDTH_PERCENT, height: height});
    this._editButton.setSize({width: width * 0.01 * this.PROPORTIONS.EDIT_BUTTON_WIDTH_PERCENT, height: height});
    this._copyButton.setSize({width: width * 0.01 * this.PROPORTIONS.COPY_BUTTON_WIDTH_PERCENT, height: height});
    this._deleteButton.setSize({width: width * 0.01 * this.PROPORTIONS.DELETE_BUTTON_WIDTH_PERCENT, height: height});
  },

  getElement: function() {
    return this._element.root;
  },

  remove: function() {
    if (!this._element.root.parentNode) {
      return;
    }
    console.log("destroying: " + this._id);
    this._destroyElement();
    this.getWindow().removeMaterialInterface(this);
  },

  _destroyElement: function() {
    this._element.root.parentNode.removeChild(this._element.root);
  },

  _createElement: function() {
    var element = document.createElement("table");
    var row = document.createElement("tr");
    var selectCell = document.createElement("td");
    var editCell = document.createElement("td");
    var copyCell = document.createElement("td");
    var deleteCell = document.createElement("td");
    element.appendChild(row);
    row.appendChild(selectCell);
    row.appendChild(editCell);
    row.appendChild(copyCell);
    row.appendChild(deleteCell);

    return {
      root: element,
      select: selectCell,
      edit: editCell,
      copy: copyCell,
      delete: deleteCell
    };
  },

  _initSelectButton: function() {
    var selectButton = new ccssl.MaterialButtonsInterface.SelectButton().init(this._material, this);
    selectButton.setParent(this._element.select);
    return selectButton;
  },

  _initEditButton: function() {
    var editButton = new ccssl.MaterialButtonsInterface.EditButton().init(this._material, this);
    editButton.setParent(this._element.edit);
    return editButton;
  },

  _initCopyButton: function() {
    var copyButton = new ccssl.MaterialButtonsInterface.CopyButton().init(this._material, this);
    copyButton.setParent(this._element.copy);
    return copyButton;
  },

  _initDeleteButton: function() {
    var deleteButton = new ccssl.MaterialButtonsInterface.DeleteButton().init(this._material, this);
    deleteButton.setParent(this._element.delete);
    return deleteButton;
  }
});