ccssl.CommandCenter = cc.Class.extend({
  run: function(commandData) {
    var command = new ccssl[commandData.message.capitalize()]();
    command.init(commandData);
    command.run();
  }
});
