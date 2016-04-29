ccs.load = function(_load) {
  return function(file) {
    var timeline2Parser = ccs._load.getParser("timeline", "2.*");

    timeline2Parser.initSingleNode = function(json){
      var node = new ccui.Widget();

      this.generalAttributes(node, json);

      return node;
    };

    var loadedPlist = {};
    var loadTexture = function(json, resourcePath, cb){
      if(json != null){
        var path = json["Path"];
        var type;
        if(json["Type"] === "Default" || json["Type"] === "Normal")
          type = 0;
        else
          type = 1;
        var plist = json["Plist"];
        if(plist){
          if(cc.loader.getRes(resourcePath + plist)){
            loadedPlist[resourcePath + plist] = true;
            cc.spriteFrameCache.addSpriteFrames(resourcePath + plist);
          }else{
            if(!loadedPlist[resourcePath + plist] && !cc.spriteFrameCache.getSpriteFrame(path))
              cc.log("%s need to be preloaded", resourcePath + plist);
          }
        }
        if(type !== 0){
          if(cc.spriteFrameCache.getSpriteFrame(path))
            cb(path, type);
          else
            cc.log("failed to get spriteFrame: %s", path);
        }else
          cb(resourcePath + path, type);
      }
    };

    var getColor = function(json){
      if(!json) return;
      var r = json["R"] != null ? json["R"] : 255;
      var g = json["G"] != null ? json["G"] : 255;
      var b = json["B"] != null ? json["B"] : 255;
      var a = json["A"] != null ? json["A"] : 255;
      return cc.color(r, g, b, a);
    };

    timeline2Parser.initSprite = function(json, resourcePath){
      var widget = new ccui.ImageView();
      var node =  new cc.Sprite();

      loadTexture(json["FileData"], resourcePath, function(path, type){
        widget.loadTexture(path, type);
      });

      var blendData = json["BlendFunc"];
      if(json["BlendFunc"]) {
        var blendFunc = cc.BlendFunc.ALPHA_PREMULTIPLIED;
        if (blendData["Src"] !== undefined)
          blendFunc.src = blendData["Src"];
        if (blendData["Dst"] !== undefined)
          blendFunc.dst = blendData["Dst"];
        widget._imageRenderer.setBlendFunc(blendFunc);
      }

      if(json["FlipX"])
        widget._imageRenderer.setFlippedX(true);
      if(json["FlipY"])
        widget._imageRenderer.setFlippedY(true);

      this.widgetAttributes(widget, json);
      var color = json["CColor"];
      if(color != null)
        widget.color = getColor(color);

      return widget;
    };

    //サブパーサーの再登録
    var register = [
      {name: "LayerObjectData", handle: timeline2Parser.initSingleNode},
      {name: "SingleNodeObjectData", handle: timeline2Parser.initSingleNode},
      {name: "SpriteObjectData", handle: timeline2Parser.initSprite}
    ];

    register.forEach(function(item){
      timeline2Parser.registerParser(item.name, function(options, resourcePath){
        var node = item.handle.call(this, options, resourcePath);
        this.parseChild(node, options["Children"], resourcePath);
        return node;
      });
    });

    //直したパーサーを再登録
    ccs._load.registerParser("timeline", "2.*", timeline2Parser);
    return _load(file);
  }
}(ccs.load);