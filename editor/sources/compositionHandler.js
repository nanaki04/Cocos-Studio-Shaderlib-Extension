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
          type: "row",
          rows: [
            [
              {
                type: "row",
                rows: [
                  {
                    type: "simulator",
                    width: { fixed: false, weight: 1 },
                    height: { fixed: false, weight: 1 }
                  }
                ]
              },
              {
                type: "row",
                rows: [
                  {
                    type: "timeline",
                    width: { fixed: false, weight: 1 },
                    height: { fixed: true, px: 150 }
                  }
                ]
              }
            ],
            [
              {
                type: "windowCollection",
                width: { fixed: true, px: 500 },
                height: { fixed: false, weight: 1 }
              }
            ]
          ]
        }
      ]
    ]
  },

  init: function() {
    this._composition = this.DEFAULT_CONFIG;
  },

  buildComposition: function() {

  },

  _parseRowLevel: function(rows, assignedHeight, assignedWidth) {

  },

  calculateValuePerWeight: function(rows, assignedValue, valueType) {
    var totalWeight = 0;
    return Math.floor(rows.reduce(function(remainingValue, row) {
      if (!row[valueType] || !row[valueType].fixed) {
        totalWeight++;
      } else {
        remainingValue -= row[valueType].px;
      }
      return remainingValue;
    }, assignedValue) / totalWeight);
  }

};
