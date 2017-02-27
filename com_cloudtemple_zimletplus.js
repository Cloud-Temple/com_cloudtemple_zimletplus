/*
com_cloudtemple_zimletplus
Copyright (C) 2016-2017 - CloudTemple

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>. */

function com_cloudtemple_zimletplus_HandlerObject() {}

com_cloudtemple_zimletplus_HandlerObject.prototype = new ZmZimletBase();
com_cloudtemple_zimletplus_HandlerObject.prototype.constructor = com_cloudtemple_zimletplus_HandlerObject;

com_cloudtemple_zimletplus_HandlerObject.prototype.init = function() {
  if (this.getUserProperty("tabs") == undefined) {
    this.setUserProperty("tabs", JSON.stringify([]), true);
  }

  this.tabs = JSON.parse(this.getUserProperty("tabs"));

  for (var i=0; i<this.tabs.length; i++) {
    var tab = this.tabs[i];
    tab.dwt = this.createApp(tab.name, null, tab.url);
  }

  this.tabApps = [];
  this.setPropertyDialog();
  this._limitOnglet = 4;
};

com_cloudtemple_zimletplus_HandlerObject.prototype.doubleClicked = function() { this.singleClicked(); };

com_cloudtemple_zimletplus_HandlerObject.prototype.singleClicked = function() {
  if (this.EditUPDialog) {
    this.setUPSViewContent();
    this.EditUPDialog.popup();
    document.getElementById("tEditUPS").getElementsByTagName("input")[0].focus();
  }
};

com_cloudtemple_zimletplus_HandlerObject.prototype.addTr = function() {
  try {
    var tableRef = document.getElementById('tEditUPS').getElementsByTagName('tbody')[0];

    if (tableRef.getElementsByTagName('tr').length <= this._limitOnglet) {
      var newRow   = tableRef.insertRow(tableRef.rows.length);

      var newNameCell  = newRow.insertCell(0);
      var newUrlCell  = newRow.insertCell(1);
      var newDeleteCell  = newRow.insertCell(2);

      var newNameInput = document.createElement("input");
      newNameInput.type = "text";
      newNameInput.name = "name";
      newNameInput.className = "zplusname";
      newNameCell.appendChild(newNameInput);

      var newUrlInput = document.createElement("input");
      newUrlInput.type = "text";
      newUrlInput.name = "url";
      newUrlInput.className = "zplusurl";
      newUrlCell.appendChild(newUrlInput);

      var deleteDiv = document.createElement("div");
      deleteDiv.className = "divDeleteUrl";
      deleteDiv.onclick = function(){ com_cloudtemple_zimletplus_HandlerObject.deleteUP(this) };
      newDeleteCell.appendChild(deleteDiv);
    }
  } catch(e) {}
};

com_cloudtemple_zimletplus_HandlerObject.prototype.appActive = function(appName, active) {
  if (active) {
    skin._showEl("zb__NEW_MENU",false);
    skin._showEl("skin_td_tree",false);
    skin._showEl("skin_tr_toolbar",false);
    skin._showEl("z_sash",false);
    skin._showEl("skin_tr_toolbar",false);
    skin._showEl("skin_td_tree_app_sash",false);
    document.getElementById("skin_td_main").style.width = "100%";
    skin._reflowApp();
  }
  else {
    skin._showEl("zb__NEW_MENU",true);
    skin._showEl("skin_td_tree",true);
    skin._showEl("skin_tr_toolbar",true);
    skin._showEl("z_sash",true);
    skin._showEl("skin_tr_toolbar",true);
    skin._showEl("skin_td_tree_app_sash",true);
    document.getElementById("skin_td_main").style.width = "auto";
    skin._reflowApp();
  }
};

com_cloudtemple_zimletplus_HandlerObject.prototype.get_tab_by_dwt = function(appName) {
  var tab = null;

  for (var i=0; i<this.tabs.length; i++) {
    if (this.tabs[i].dwt == appName) {
      tab = this.tabs[i];
      break;
    }
  }
  return tab;
};

com_cloudtemple_zimletplus_HandlerObject.prototype.appLaunch = function(appName) {
  var tab = this.get_tab_by_dwt(appName);
  var url = this.completeUrl(tab.url);
  var app = appCtxt.getApp(appName);
  var iframe_id = "zplusApp_" + appName.split("_")[3].toString();

  if (url.length > 0) {
    app.setContent("<div id=\"TPersoContainer\"><iframe id=\"" + iframe_id + "\"  src=\"" + url.toString() + "\" style=\"position: absolute; border: none; width: 100%; height: 100%;\"\" /></iframe></div>");
  } else {
    app.setContent("<div id=\"TPersoContainer\" class=\"divNoUrl\"><h1 style=\"margin:0\">" + zimlet.getMessage("noContentInfo1") + "</h1><p>" + zimlet.getMessage("noContentInfo2") + "</p></div>");
  }
};

com_cloudtemple_zimletplus_HandlerObject.prototype.checkUrl = function(url) {
  var regexp = /((ftp|http|https):\/\/(www.)?(([a-zA-Z0-9-]){2,}\.){1,4}([a-zA-Z]){2,6}(\/([a-zA-Z-_\/\.0-9#:?=&;,]*)?)?)/;
  return (regexp.test(url));
};

com_cloudtemple_zimletplus_HandlerObject.prototype.completeUrl = function(url) {
  var newUrl = url;
  var r = /(ftp|http|https):\/\//;
    if (!r.test(newUrl)) { newUrl = "http://" + newUrl }
    return newUrl;
};

com_cloudtemple_zimletplus_HandlerObject.prototype.setPropertyDialog = function() {
  this._editUPSView = new DwtComposite(this.getShell());
  this._editUPSView.setSize("500", "200");
  this._editUPSView.getHtmlElement().style.overflow = "auto";
  this.setUPSViewContent();

  var addTrButton = new DwtDialog_ButtonDescriptor("ADDTR", (this.getMessage("addTrBtnName")), DwtDialog.ALIGN_RIGHT);
  var validButton = new DwtDialog_ButtonDescriptor("VALIDUPS", (this.getMessage("validBtnName")), DwtDialog.ALIGN_RIGHT);

  this.EditUPDialog = this._createDialog({
    title: this.getMessage("editDialogTitle"),
    view: this._editUPSView,
    standardButtons: [DwtDialog.CANCEL_BUTTON],
    extraButtons:[addTrButton, validButton]
  });

  this.EditUPDialog.setButtonListener("ADDTR", new AjxListener(this, this.addTr));
  this.EditUPDialog.setButtonListener("VALIDUPS", new AjxListener(this, this.setUserProperties)); 
};

com_cloudtemple_zimletplus_HandlerObject.prototype.setUPSViewContent = function() {
  var i = 0;
  var tabindex = 1;
  var html = new Array();

  html[i++] = "<p class='docInfo'>" + this.getMessage("docInfo") + " <strong><a href='" + this.getResource("doc_cloudtemple_zimletplus.pdf") + "' target='_blank'>documentation</strong></a>.</p>";
  html[i++] = "<table id=\"tEditUPS\" class=\"tEditUPS\" border=\"0\"><tbody>";
  html[i++] = "<tr><th width=\"50%\">" + this.getMessage("nameCTitle") + "</th><th colspan='2'>" + this.getMessage("urlCTitle") + "</th></tr>";

  if (this.tabs.length == 0) {
    html[i++] = "<tr><td><input name='name' type='text' value='' class='zplusname'></td><td><input name='url' type='text' value='' class='zplusurl'></td>";
    html[i++] = "<td><div class='divDeleteUrl' onclick='com_cloudtemple_zimletplus_HandlerObject.deleteUP(this)'></div></td></tr>";
  } else {
    for (var j=0; j<this.tabs.length; j++) {
      var tab = this.tabs[j];
      html[i++] = "<tr><td><input name='name' type='text' value='" + tab.name + "' class='zplusname'></td>";
      html[i++] = "<td><input name='url' type='text' value='" + tab.url + "' class='zplusurl'></td><td><div class='divDeleteUrl' onclick='com_cloudtemple_zimletplus_HandlerObject.deleteUP(this)'></div></td></tr>";
    }
  }

  html[i++] = "</tbody></table>";

  this._editUPSView.setContent(html.join(""));
};

com_cloudtemple_zimletplus_HandlerObject.prototype.setUserProperties = function() {
  if (document.getElementById("tEditUPS")) {
    var tabs_tmp = [];
    var trsUPS = document.getElementById("tEditUPS").getElementsByTagName('tr');

    for (var i=0; i<trsUPS.length; i++) {
      var inputsUPS = trsUPS[i].getElementsByTagName('input');
      if(inputsUPS.length == 0){continue;}

      var name = inputsUPS[0].value;
      var url = this.completeUrl(inputsUPS[1].value);

      tabs_tmp.push({name: name, url: url});
    }

    this.EditUPDialog.popdown();

    if (this.isValidUserProperties(tabs_tmp)) {
      this.setUserProperty("tabs", JSON.stringify(tabs_tmp), true);
      this._refreshBrowser();
    }
  }
};

com_cloudtemple_zimletplus_HandlerObject.prototype.isValidUserProperties = function(tabs_tmp) {
  if (tabs_tmp.length == 0) {
    return true;
  } else {
    for (var i=0; i<tabs_tmp.length; i++) {
      var tab = tabs_tmp[i];
      if (!this.checkUrl(tab.url)) {
        var msg = this.getMessage("warningCheckUrl") + " " + tab.url;
        var s = appCtxt.getMsgDialog();
        s.reset();
        s.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._warningPopDown, s));
        s.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
        s.popup();
        return false;
      }
    }
    return true;
  }
};

com_cloudtemple_zimletplus_HandlerObject.prototype._warningPopDown = function(s, t) {
  s.popdown();
  this.singleClicked();
};

com_cloudtemple_zimletplus_HandlerObject.prototype._refreshBrowser = function() {
  var s=appCtxt.getMsgDialog();
  s.reset();
  s.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._refreshBrowserCallback, s));
  s.setMessage(this.getMessage("pageReload"),DwtMessageDialog.WARNING_STYLE);
  s.popup();
};

com_cloudtemple_zimletplus_HandlerObject.prototype._refreshBrowserCallback = function(s, t) {
  s.popdown();
  window.onbeforeunload=null;
  var e=AjxUtil.formatUrl({}
      );
  window.location.replace(e)
};

com_cloudtemple_zimletplus_HandlerObject.deleteUP = function(elm) {
  try{
    trElmToDelete = elm.parentNode.parentNode;
    trElmToDelete.parentNode.removeChild(trElmToDelete);
  }catch(e){}
};
