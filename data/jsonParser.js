(function() {
  var fs = require('fs');
  var progressHandler = require('../utility/progressHandler');

  var parseJson = function(path, collectResourceList) {
    _loadJson(path, function(json) {
      var serverPath = path.substring(0, path.search(/\/([^\/]*)$/) + 1).replace(/^projects\//, "");
      _findJsonParser(json)(json, serverPath, collectResourceList);
    });
  };

  var _loadJson = function(path, collectJson) {
    console.log("LOADING JSON: " + path);

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
    console.log(resources.length);

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
    console.log("getting node list: " + json);

    var base = json["Content"]["Content"];
    var nodes = base["ObjectData"];
    var path = startingPath || "";
    var tracker = progressHandler.createTracker();

    var loopNodes = function(node) {
      var nodeInfo = _createNodeInfo(node, path);
      path += "/" + (node.Name || "...");

      if (node.ctype === "ProjectNodeObjectData" && node.FileData && /\.json$/i.test(node.FileData.Path)) {
        tracker.add(function(_nodeList, done) {
          console.log("getting sub nodes: " + rootPath + node.FileData.Path);
          console.log(path);
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
    return {
      name: node.Name,
      path: path,
      tag: node.Tag,
      type: node.ctype,
      externalChildren: {},
      children: []
    }
  };

  module.exports.parseJson = parseJson;
  module.exports.getNodeList = getNodeList;
})();
