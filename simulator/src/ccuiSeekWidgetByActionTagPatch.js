ccui.helper.seekActionWidgetByActionTag = function(origin) {
  return function(root, tag) {
    if (root && root.getActionTag) {
      return origin(root, tag);
    }
    var arrayRootChildren = root.getChildren();
    for (var i = 0; i < arrayRootChildren.length; i++) {
      var child = arrayRootChildren[i];
      var res = ccui.helper.seekActionWidgetByActionTag(child, tag);
      if (res !== null)
        return res;
    }
    return null;
  }
}(ccui.helper.seekActionWidgetByActionTag);
