(function() {
  var fs = require('fs');
  var progressHandler = require('../utility/progressHandler');
  var nodeDefinitions = require('../enums/nodeDefinitions');

  var parseJson = function(path, collectResourceList) {
    _loadJson(path, function(json) {
      var serverPath = path.substring(0, path.search(/\/([^\/]*)$/) + 1).replace(/^projects\//, "");
      _findJsonParser(json)(json, serverPath, collectResourceList);
    });
  };

  var getBase = function(json) {
    var base = (json["Content"] && json["Content"]["Content"]) || json["widgetTree"] || json["nodeTree"] || json["gameobjects"];
    if (base) {
      return base;
    }
    console.log("data/jsonParser: unable to parse json base");
    return json;
  };

  var _loadJson = function(path, collectJson) {
    fs.readFile(path, function(err, json) {
      collectJson(JSON.parse(json));
    });
  };

  var _findJsonParser = function(json) {
    if (_isCcs2(json)) {
      return _parseJsonCcs2;
    }
    return function() {
      console.log("jsonParser: no parser found");
      return [];
    };
  };

  var _isCcs2 = function(json) {
    return json["Content"] && json["Content"]["Content"];
  };

  var _parseJsonCcs2 = function(json, rootPath, collectResourceList) {
    var resources = [];
    var base = json["Content"]["Content"];
    var nodes = base["ObjectData"];
    var animation = base["Animation"];
    var timelines = (animation && animation["TimeLines"]) || [];

    var loopNodes = function(root) {
      if (!root)
        return;

      var fileData = root["FileData"] || root["ImageFileData"] || root["LabelAtlasFileImage_CNB"];
      if (fileData && fileData["Plist"]) {
        resources.push(rootPath + fileData["Plist"]);
      } else if (fileData && fileData["Path"]) {
        resources.push(rootPath + fileData["Path"]);
      }

      var children = root["Children"];
      if (!children || !children.length)
        return;

      children.forEach(function(child) {
        loopNodes(child);
      });
    };
    loopNodes(nodes);
    loopNodes = null;

    timelines.forEach(function(timeline) {
      if (timeline["Property"] !== "FileData")
        return;

      var frames = timeline["Frames"] || [];
      frames.forEach(function(frame) {
        var texture = frame["TextureFile"];
        if (texture["Plist"]) {
          resources.push(rootPath + texture["Plist"]);
        } else if (texture("Path")) {
          resources.push(rootPath + texture["Path"]);
        }
      });
    });

    var sequence = progressHandler.createSequence(resources);
    var jsons = _extractJsons(resources);

    jsons.forEach(function(json) {
      sequence.add(function(_resources, collectResources) {
        parseJson("projects/" + json, function(__resources) {
          collectResources(_resources.concat(__resources));
        });
      });
    });

    sequence.onEnd(collectResourceList);
    if (!jsons.length) sequence.forceEnd();
  };

  var _parseJsonArmature = function(json) {};

  var _extractJsons = function(resourceList) {
    return (resourceList || []).reduce(function(jsonList, resource) {
      if (/\.json$/i.test(resource)) jsonList.push(resource);
      return jsonList;
    }, []);
  };

  var getNodeList = function(jsonPath, nodePath, collectNodeList) {
    _loadJson(jsonPath, function(json) {
      if (_isCcs2(json)) {
        _getCcs2NodeList(json, jsonPath.substr(0, jsonPath.search(/[^/]*$/)), nodePath, collectNodeList);
      }
    });
  };

  var _getCcs2NodeList = function(json, rootPath, startingPath, collectNodeList) {
    var base = json["Content"]["Content"];
    var nodes = base["ObjectData"];
    var path = startingPath || "";
    var tracker = progressHandler.createTracker();
    tracker._instanceID = rootPath + startingPath;

    var loopNodes = function(node) {
      var nodeInfo = _createNodeInfo(node, path);
      path += "/" + (node.Name || "...");

      if (node.ctype === "ProjectNodeObjectData" && node.FileData && /\.json$/i.test(node.FileData.Path)) {
        tracker.add(function(_nodeList, done, _tracker) {
          getNodeList(rootPath + node.FileData.Path, path, function(__nodeList) {
            nodeInfo.externalChildren = __nodeList;
            done(_nodeList);
          });
        });
      }

      var children = node.Children;

      if (!children || !children.length)
        return nodeInfo;

      nodeInfo.children = children.map(function(child) {
        return loopNodes(child);
      });
      return nodeInfo;
    };

    var rootNode = loopNodes(nodes);
    tracker.onEnd(function() {
      collectNodeList(rootNode);
    });
    tracker.forceUpdate();
  };

  var _createNodeInfo = function(node, path) {
    var nodeIdentifierType = _getNodeIdentifierType(node);
    return {
      name: node.Name,
      path: path,
      tag: node.Tag,
      type: node.ctype,
      identifierType: nodeIdentifierType,
      identifier: _getNodeIdentifier(node, nodeIdentifierType),
      externalChildren: {},
      children: []
    }
  };

  var _getNodeIdentifierType = function(node) {
    if (node.Tag) return nodeDefinitions.NODE_ITENTIFIER_TYPES.TAG;
    if (node.ActionTag) return nodeDefinitions.NODE_ITENTIFIER_TYPES.ACTION_TAG;
    return nodeDefinitions.NODE_ITENTIFIER_TYPES.NAME;
  };

  var _getNodeIdentifier = function(node, identifierType) {
    if (identifierType === nodeDefinitions.NODE_ITENTIFIER_TYPES.TAG) return node.Tag;
    if (identifierType === nodeDefinitions.NODE_ITENTIFIER_TYPES.ACTION_TAG) return node.ActionTag;
    return node.Name;
  };

  var getAnimationData = function(jsonPath, collectAnimationData) {
    _loadJson(jsonPath, function(json) {
      if (_isCcs2(json)) {
        collectAnimationData(_getCcs2AnimationData(json));
        return;
      }
      console.log("jsonParser.getAnimationData: no adequate parser found.");
      return collectAnimationData({});
    });
  };

  var _getCcs2AnimationData = function(json) {
    var base = json["Content"]["Content"];
    return {
      duration: base["Animation"]["Duration"],
      speed: base["Animation"]["Speed"],
      animations: (base["AnimationList"] || []).map(function(animationData) {
        return {
          startIndex: animationData["StartIndex"],
          endIndex: animationData["EndIndex"],
          name: animationData["Name"]
        }
      })
    };
  };

  module.exports.parseJson = parseJson;
  module.exports.getNodeList = getNodeList;
  module.exports.getBase = getBase;
  module.exports.getAnimationData = getAnimationData;
})();
