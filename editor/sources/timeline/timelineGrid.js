ccssl.TimelineGrid = ccssl.Class.define({
  init: function(timelineData) {
    this._element = this._createElement();
    this.reload(timelineData);

    return this;
  },

  redraw: function() {
    this.destroyTable();
    this._table = this._createTable();
    this.getElement().appendChild(this._table.element);
  },

  reload: function(timelineData) {
    this._keyframes = timelineData.keyframes;
    this._animation = timelineData.animation;
    this._activeMaterials = timelineData.activeMaterials;

    this.redraw();
  },

  getElement: function() {
    return this._element;
  },

  getTable: function() {
    return this._table;
  },

  destroyTable: function() {
    var table = this._table;
    this._table = null;
    if (table == null) {
      return;
    }
    table.destroy();
  },

  _getAnimation: function() {
    return this._animation;
  },

  _getKeyframes: function() {
    return this._keyframes;
  },

  _createElement: function() {
    var element = document.createElement("div");

    return element;
  },

  _getActiveMaterials: function(collectMaterials) {
    ccssl.cache.materials.getActiveMaterials(collectMaterials);
  },

  _getRowNames: function() {
    return this._activeMaterials.map(function(material) {
      return material.name;
    });
  },

  _getColumnNames: function() {
    var animation = this._getAnimation();

    if (!animation || !animation.duration) {
      return [];
    }
    var columnNames = [];
    for (var x = 0; x <= animation.duration; x++) {
      columnNames.push(x);
    }
    return columnNames;
  },

  _createTable: function() {
    var activeMaterials = this._activeMaterials;

    var table = {
      element: document.createElement("table")
    };
    table.element.style.border = "1px solid black";
    table.element.style.tableLayout = "fixed";
    table.rows = this._createRows(activeMaterials, table);
    table.destroy = this._destroyTable.bind(null, table);

    return table;
  },

  _createRows: function(activeMaterials, table) {
    var header = this._createHeaderRow(table);

    var rows = activeMaterials.reduce(function(keyframeDataTable, material) {
      var row = {
        material: material,
        element: this._createTrElement(),
        parent: table
      };
      row.cells = this._createCells(row, material);
      row.destroy = this._destroyRow.bind(null, row);
      table.element.appendChild(row.element);

      keyframeDataTable[material.id] = row;
      return keyframeDataTable;
    }.bind(this), {});

    rows.header = header;

    return rows;
  },

  _createHeaderRow: function(table) {
    var headerRow = {
      element: this._createTrElement(),
      parent: table
    };
    headerRow.destroy = this._destroyRow.bind(null, headerRow);


    table.element.appendChild(headerRow.element);

    var upperLeftCell = {
      index: 0,
      element: document.createElement("th")
    };
    upperLeftCell.destroy = this._destroyCell.bind(null, upperLeftCell);
    upperLeftCell.element.style.width = "150px";

    headerRow.element.appendChild(upperLeftCell.element);

    headerRow.cells = this._getColumnNames().map(function(columnName, index) {
      var cell = {
        index: index + 1,
        element: this._createThElement(),
        parent: headerRow
      };
      cell.destroy = this._destroyCell.bind(null, cell);
      cell.element.innerHTML = columnName;

      headerRow.element.appendChild(cell.element);
      return cell;
    }.bind(this));

    headerRow.cells.unshift(upperLeftCell);

    return headerRow;
  },

  _createCells: function(row, material) {
    var headerCell = this._createHeaderCell(row);

    var cells = this._getColumnNames().map(function(columnName, index) {
      var cell = {
        index: index + 1,
        element: this._createTdElement(),
        parent: row
      };
      cell.destroy = this._destroyCell.bind(null, cell);
      cell.keyframe = this._createKeyframe(cell, material);
      row.element.appendChild(cell.element);
      return cell;
    }.bind(this));

    cells.unshift(headerCell);

    return cells;
  },

  _createHeaderCell: function(row) {
    var headerCell = {
      index: 0,
      element: this._createTdElement(),
      parent: row
    };
    headerCell.destroy = this._destroyCell.bind(null, headerCell);

    row.element.appendChild(headerCell.element);

    var div = document.createElement("div");
    div.innerHTML = row.material.name + "{" + row.material.id + "}";
    headerCell.element.appendChild(div);

    return headerCell;
  },

  _createKeyframe: function(cell, material) {
    var keyframe = new ccssl.TimelineKeyframe().init(this._keyframes, material);
    cell.element.appendChild(keyframe.getElement());

    return keyframe;
  },

  _createTdElement: function() {
    var element = document.createElement("td");
    element.style.border = "1px solid black";

    return element;
  },

  _createThElement: function() {
    var element = document.createElement("th");
    element.style.border = "1px solid black";

    return element;
  },

  _createTrElement: function() {
    return document.createElement("tr");
  },

  _destroyTable: function(table) {
    var keys = Object.keys(table.rows);
    keys.forEach(function(key) {
      table.rows[key].destroy();
    }.bind(this));
    table.element.parentNode.removeChild(table.element);
    table.element = null;
    table.destroy = null;
  },

  _destroyRow: function(row) {
    row.cells.forEach(function(cell) {
      cell.destroy();
    });
    row.element.parentNode.removeChild(row.element);
    row.element = null;
    row.parent = null;
    row.material = null;
    row.destroy = null;
  },

  _destroyCell: function(cell) {
    if (cell.keyframe) {
      cell.keyframe.destroy();
    }
    cell.element.parentNode.removeChild(cell.element);
    cell.element = null;
    cell.parent = null;
    cell.material = null;
    cell.destroy = null;
  }
});
