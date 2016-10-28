ccssl.TimelineRecordButton = ccssl.ToggleButton.extend({
  CSS: {
    bg: {
      normal: "record-button-normal-bg",
      selected: "record-button-selected-bg"
    },
    content: {
      normal: "record-button-normal",
      selected: "record-button-selected",
      font: "menu-item-font"
    }
  },

  init: function(timelineData) {
    this.base.init.call(this, "");
    this.setCss(this.CSS);
    this.redraw();

    return this;
  },

  redraw: function() {
    this._element = this._createElement(this._name);
    this.setRect({
      x: 0,
      y: 0,
      width: 25,
      height: 25
    });
  },

  reload: function() {

  },

  enableRecordMode: function() {
    console.log("todo: implement record mode");
  },

  disableRecordMode: function() {
    console.log("todo: implement record mode");
  }
});
