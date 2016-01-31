ccssl.communicator = {
  _getAjaxObject: function() {
    return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  },

  get: function(request, collectData) {
    var ajax = this._getAjaxObject();
    ajax.onreadystatechange = function() {
      if (ajax.readyState !== 4 || ajax.status !== 200) {
        return;
      }
      collectData(JSON.parse(ajax.responseText));
    };
    ajax.open("GET", request, true);
    ajax.send();
  },

  post: function(request, data, collectData) {
    var ajax = this._getAjaxObject();
    ajax.onreadystatechange = function() {
      if (ajax.readyState !== 4 || ajax.status !== 200) {
        return;
      }
      collectData(JSON.parse(ajax.responseText));
    };
    ajax.open("POST", request, true);
    ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    ajax.send(JSON.stringify(data));
  }
};