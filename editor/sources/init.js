document.body.onload = function() {
  ccssl.menuSelectionHandler.init();

  new ccssl.MainMenu().init();
  ccssl.nodeWindow = new ccssl.NodeWindow().init();

  var simulatorWindow = document.getElementById("simulator");
  simulatorWindow.style.top = "50px";
  simulatorWindow.style.left = "0px";
  ccssl.HtmlElementAlignmentHandler.stretchWidth(simulatorWindow, 510);
  ccssl.HtmlElementAlignmentHandler.stretchHeight(simulatorWindow, 10);
};