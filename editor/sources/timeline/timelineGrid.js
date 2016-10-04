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
    if (table.element.parentNode == null) {
      return;
    }
    table.element.parentNode.removeChild(table.element);
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

    table.element.appendChild(headerRow.element);

    var upperLeftCell = {
      index: 0,
      element: document.createElement("th"),
      parent: headerRow
    };
    upperLeftCell.element.style.width = "150px";

    headerRow.element.appendChild(upperLeftCell.element);

    headerRow.cells = this._getColumnNames().map(function(columnName, index) {
      var cell = {
        index: index + 1,
        element: this._createThElement(),
        parent: headerRow
      };
      cell.element.innerHTML = columnName;

      headerRow.element.appendChild(cell.element);
      return cell;
    }.bind(this));

    headerRow.cells.unshift(upperLeftCell);

    return headerRow;
  },

  _createCells: function(row) {
    var headerCell = this._createHeaderCell(row);

    var cells = this._getColumnNames().map(function(columnName, index) {
      var cell = {
        index: index + 1,
        element: this._createTdElement(),
        parent: row
      };
      cell.keyframe = this._createKeyframe(cell);
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

    row.element.appendChild(headerCell.element);

    var div = document.createElement("div");
    div.innerHTML = row.material.name + "{" + row.material.id + "}";
    headerCell.element.appendChild(div);

    return headerCell;
  },

  _createKeyframe: function(cell) {
    var div = document.createElement("div");
    div.style.width = "25px";
    cell.element.appendChild(div);
  },

  _createTdElement: function(width) {
    var element = document.createElement("td");
    element.style.border = "1px solid black";

    return element;
  },

  _createThElement: function(width) {
    var element = document.createElement("th");
    element.style.border = "1px solid black";

    return element;
  },

  _createTrElement: function() {
    return document.createElement("tr");
  }
});
