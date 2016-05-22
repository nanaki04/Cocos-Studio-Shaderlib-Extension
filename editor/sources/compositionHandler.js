ccssl.compsitionHandler = {
  DEFAULT_CONFIG: {
    rows: [
      [
        {
          type: "mainMenu"
        }
      ],
      [
        {
          type: "row",
          rows: [
            [
              {
                type: "simulator"
              }
            ],
            [
              //timeline
            ]
          ]
        },
        {
          type: "windowCollection"
        }
      ]
    ]
  },

  _rows: [],

  addRow: function() {
  },

  insertRow: function(index) {
    this._rows.splice(index, 0, []);
  },

  _createCell: function(fixedSize) {
    return {
      fixedSize: fixedSize
    }
  }
};
