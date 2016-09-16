document.body.onload = function() {
  ccssl.menuSelectionHandler.init();
  var comp = ccssl.compositionHandler.init();

  comp.registerElement(
    new ccssl.MainMenu().init(),
    comp.ELEMENT_TYPES.MAIN_MENU
  );

  comp.registerElement(
    new ccssl.SimulatorFrame().init(),
    comp.ELEMENT_TYPES.SIMULATOR
  );

  comp.registerElement(
    new ccssl.NodeWindow().init(),
    comp.ELEMENT_TYPES.NODE_WINDOW
  );

  comp.registerElement(
    new ccssl.Timeline().init(),
    comp.ELEMENT_TYPES.TIMELINE
  );

  comp.buildComposition();

  //var windowCollection = new ccssl.WindowCollection().init(
  //  { x: 0, y: 50 },
  //  { width: 500, height: 800 }
  //);
  //windowCollection.addWindow(ccssl.nodeWindow);
  //windowCollection.addWindow(new ccssl.NodeWindow().init());
  //ccssl.HtmlElementAlignmentHandler.alignRight(windowCollection.getElement());
  //ccssl.HtmlElementAlignmentHandler.stretchHeight(windowCollection.getElement());
  //
  //var simulatorWindow = document.getElementById("simulator");
  //simulatorWindow.style.top = "50px";
  //simulatorWindow.style.left = "0px";
  //ccssl.HtmlElementAlignmentHandler.stretchWidth(simulatorWindow, 510);
  //ccssl.HtmlElementAlignmentHandler.stretchHeight(simulatorWindow, 10);
};