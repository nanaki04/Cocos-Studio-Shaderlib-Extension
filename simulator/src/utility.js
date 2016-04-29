ccsl.Utility = {
  getScreenCenter: function() {
    var winSize = cc.winSize;
    return cc.p(
      winSize.width / 2,
      winSize.height / 2
    )
  }
};