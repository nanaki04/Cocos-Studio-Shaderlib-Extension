(function() {
  var envConfig = {
    rootPath: "localhost:1337/"
  };

  if (module) {
    module.exports.envConfig = envConfig;
  } else {
    ccssl.envConfig = envConfig;
  }
})();