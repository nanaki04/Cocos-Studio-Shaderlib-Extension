document.body.onload = function() {
  ccssl.menuSelectionHandler.init();

  new ccssl.MainMenu().init();
  var windowCollection = new ccssl.WindowCollection().init(
    { x: 0, y: 50 },
    { width: 500, height: 800 }
  );
  ccssl.nodeWindow = new ccssl.NodeWindow().init();
  windowCollection.addWindow(ccssl.nodeWindow);
  windowCollection.addWindow(new ccssl.NodeWindow().init());
  ccssl.HtmlElementAlignmentHandler.alignRight(windowCollection.getElement());
  ccssl.HtmlElementAlignmentHandler.stretchHeight(windowCollection.getElement());

  var simulatorWindow = document.getElementById("simulator");
  simulatorWindow.style.top = "50px";
  simulatorWindow.style.left = "0px";
  ccssl.HtmlElementAlignmentHandler.stretchWidth(simulatorWindow, 510);
  ccssl.HtmlElementAlignmentHandler.stretchHeight(simulatorWindow, 10);
};