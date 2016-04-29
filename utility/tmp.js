parser.initImageView = function(json, resourcePath){

  var widget = new ccui.ImageView();

  loadTexture(json["FileData"], resourcePath, function(path, type){
    widget.loadTexture(path, type);
  });
  loadTexture(json["ImageFileData"], resourcePath, function(path, type){
    widget.loadTexture(path, type);
  });

  var scale9Enabled = json["Scale9Enable"];
  if(scale9Enabled){
    widget.setScale9Enabled(true);
    widget.setUnifySizeEnabled(false);
    widget.ignoreContentAdaptWithSize(false);

    var scale9OriginX = json["Scale9OriginX"] || 0;
    var scale9OriginY = json["Scale9OriginY"] || 0;
    var scale9Width = json["Scale9Width"] || 0;
    var scale9Height = json["Scale9Height"] || 0;
    widget.setCapInsets(cc.rect(
      scale9OriginX ,
      scale9OriginY,
      scale9Width,
      scale9Height
    ));
  } else
    setContentSize(widget, json["Size"]);

  this.widgetAttributes(widget, json);

  return widget;
};