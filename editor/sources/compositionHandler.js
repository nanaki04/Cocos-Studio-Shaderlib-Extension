ccssl.compositionHandler = {
  DEFAULT_CONFIG: {
    rows: [
      [
        {
          type: "mainMenu",
          width: { fixed: false, weight: 1 },
          height: { fixed: true, px: 50 }
        }
      ],
      [
        {
          type: "table",
          rows: [
            [
              {
                type: "simulator",
                width: { fixed: false, weight: 1 },
                height: { fixed: false, weight: 1 }
              }
            ],
            [
              {
                type: "timeline",
                width: { fixed: false, weight: 1 },
                height: { fixed: true, px: 150 }
              }
            ]
          ]
        },
        {
          type: "windowCollection",
          children: [
            "nodeWindow",
            "materialWindow"
          ],
          width: { fixed: true, px: 500 },
          height: { fixed: false, weight: 1 }
        }
      ]
    ]
  },

  ELEMENT_TYPES: {
    MAIN_MENU: "mainMenu",
    SIMULATOR: "simulator",
    WINDOW_COLLECTION: "windowCollection",
    NODE_WINDOW: "nodeWindow",
    MATERIAL_WINDOW: "materialWindow",
    TIMELINE: "timeline"
  },

  _registeredElements: {},

  init: function() {
    this._composition = this.DEFAULT_CONFIG;
    this._initRegisteredElementsCache();
    this._initAutoResize();

    return this;
  },

  registerElement: function(element, type) {
    this._registeredElements[type].push(element);
  },

  getRegisteredElementByType: function(type, index) {
    index = index || 0;
    if (this._registeredElements[type][index]) {
      return this._registeredElements[type][index];
    }
    var element = this._instatiateElementByType(type);
    if (element) {
      this.registerElement(element, type);
    }
    return element;
  },

  getElementRegisterIndex: function(element, type) {
    return this._registeredElements[type].indexOf(element);
  },

  buildComposition: function() {
    var rect = {
      x: 0,
      y: 0,
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };
    this._parseTableLevel(this._composition.rows, rect);
  },

  cleanUp: function() {
    window.removeEventListener("resize", this._resizeCallback);
    this._resizeCallback = null;
  },

  _initRegisteredElementsCache: function() {
    var keys = Object.keys(this.ELEMENT_TYPES);
    this._registeredElements = keys.reduce(function(_registeredElements, key) {
      var elementType = this.ELEMENT_TYPES[key];
      _registeredElements[elementType] = [];
      return _registeredElements;
    }.bind(this), this._registeredElements);
  },

  _initAutoResize: function() {
    this._resizeCallback =  this.buildComposition.bind(this);
    window.addEventListener("resize", this._resizeCallback);
  },

  _parseTableLevel: function(rows, rect) {
    var y = rect.y;
    this._calculateRowHeights(rows, rect.height).forEach(function(rowHeight, index) {
      var cells = rows[index];
      this._parseRowLevel(cells, { x: rect.x, y: y, height: rowHeight, width: rect.width });
      y += rowHeight;
    }.bind(this));
  },

  _parseRowLevel: function(cells, rect) {
    var x = rect.x;
    this._calculateCellWidths(cells, rect.width).forEach(function(cellWidth, index) {
      var cell = cells[index];
      this._parseCell(cell, { x: x, y: rect.y, height: rect.height, width: cellWidth });
      x += cellWidth;
    }.bind(this));
  },

  _parseCell: function(cell, rect) {
    if (cell.type === "table") {
      this._parseTableLevel(cell.rows, rect);
      return;
    }
    var element = this.getRegisteredElementByType(cell.type);
    if (!element) {
      return;
    }
    element.setRect(rect);
    element.redraw();
    if (cell.children) {
      this._parseCellChildren(element, cell.children);
    }
  },

  _parseCellChildren: function(parent, childrenTypes) {
    childrenTypes.forEach(function(childType) {
      var child = this.getRegisteredElementByType(childType);
      if (!child) {
        return;
      }
      parent.addChild(child);
    }.bind(this));
  },

  _instatiateElementByType: function(type) {
    if (ccssl[type.capitalize()]) {
      return new ccssl[type.capitalize()]().init({x: 0, y: 0}, {width: 0, height: 0});
    }
    return null;
  },

  _calculateRowHeights: function(rowCollection, maxHeight) {
    return this._calculateEntitySizes(rowCollection, maxHeight, "height");
  },

  _calculateCellWidths: function(cellCollection, maxWidth) {
    return this._calculateEntitySizes(cellCollection, maxWidth, "width");
  },


  _calculateEntitySizes: function(collection, maxSize, orientation) {
    var sizePerWeightInfo = this._getRowSizePerWeightInfo(collection, maxSize, orientation);
    var addedRemainder = false;
    var remainingSize = maxSize;
    var weightLessCount = 0;
    var cellSizes = collection.map(function(entity) {
      var sizeInfo = this._getSizeInfo(entity, orientation);
      if (sizeInfo[orientation] && sizeInfo[orientation].px) {
        remainingSize -= sizeInfo[orientation].px;
        return sizeInfo[orientation].px;
      }
      if (sizeInfo[orientation] && sizeInfo[orientation].weight) {
        var orientationValue;
        if (addedRemainder) {
          addedRemainder = true;
          orientationValue = sizePerWeightInfo.sizePerWeight * sizeInfo[orientation].weight + sizePerWeightInfo.remainder;
        } else {
          orientationValue = sizePerWeightInfo.sizePerWeight * sizeInfo[orientation].weight;
        }
        remainingSize -= orientationValue;
        return orientationValue;
      }
      weightLessCount++;
      return 0;
    }.bind(this));

    if (remainingSize > 0) {
      collection.map(function(entity, index) {
        var sizeInfo = this._getSizeInfo(entity, orientation);
        if (sizeInfo.type === "table" || sizeInfo[orientation].weight === 0) {
          var remainder = remainingSize % weightLessCount;
          remainingSize -= remainder;
          cellSizes[index] = remainingSize / weightLessCount + remainder;
        }
      }.bind(this));
    }

    return cellSizes;
  },

  _getSizeInfo: function(entity, orientation) {
    if (orientation === "width") {
      return entity;
    }
    return this._getRowHeightInfo(entity);
  },

  _getRowHeightInfo: function(cells) {
    var isFixed = false;
    var weight = 0;
    var fixedHeight = cells.reduce(function(height, cell) {
      if (cell.height && cell.height.px) {
        isFixed = true;
        return Math.max(height, cell.height.px);
      }
      if (cell.weight) {
        weight = Math.max(weight, cell.weight);
      }
      return height;
    }, 0);

    if (isFixed) {
      return {
        height: {
          px: fixedHeight
        }
      }
    }
    return {
      height: {
        weight: weight
      }
    }
  },

  _getRowTotalWeight: function(collection, orientation) {
    return collection.reduce(function(weight, entity) {
      if (entity[orientation] && entity[orientation].weight) {
        return weight + entity[orientation].weight;
      }
      return weight;
    }, 0);
  },

  _getTotalFixedSize: function(collection, orientation) {
    return this["_getTotalFixed" + orientation.capitalize()](collection);
  },

  _getTotalFixedWidth: function(cells) {
    return cells.reduce(function(width, cell) {
      if (cell.width && cell.width.px) {
        return width + cell.width.px;
      }
      return width;
    }, 0);
  },

  _getTotalFixedHeight: function(rows) {
    return rows.reduce(function(minimumRowSize, row) {
      return minimumRowSize + row.reduce(function(minimumCellSize, cell) {
        if (cell.height && cell.height.px) {
          return Math.max(cell.height.px, minimumCellSize);
        }
        if (cell.type === "table") {
          return Math.max(this._getTotalFixedHeight(cell.rows), minimumCellSize);
        }
        return minimumCellSize;
      }.bind(this), 0);
    }.bind(this), 0);
  },

  _getRowSizePerWeightInfo: function(collection, maxValue, orientation) {
    var flexibleSize = maxValue - this._getTotalFixedSize(collection, orientation);
    var sizePerWeight = Math.floor(flexibleSize / this._getRowTotalWeight(collection, orientation));
    return {
      sizePerWeight: sizePerWeight,
      remainder: flexibleSize % sizePerWeight
    }
  }

};
