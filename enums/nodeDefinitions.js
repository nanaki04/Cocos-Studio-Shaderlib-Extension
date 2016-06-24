(function() {
  var NODE_IDENTIFIER_TYPES = {
    "TAG": 0,
    "ACTION_TAG": 1,
    "NAME": 2
  };

  if (module) {
    module.exports.NODE_ITENTIFIER_TYPES = NODE_IDENTIFIER_TYPES;
  } else {
    ccssl.NODE_ITENTIFIER_TYPES = NODE_IDENTIFIER_TYPES;
  }
})();
