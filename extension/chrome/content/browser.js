/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Nightly Tester Tools.
 *
 * The Initial Developer of the Original Code is
 *     Dave Townsend <dtownsend@oxymoronical.com>.
 *
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var nightlyApp = {

repository: ['mozilla-central','mozilla-aurora'],

storedTitle: document.documentElement.getAttribute("titlemodifier"),

get defaultTitle() {
  var tabbrowser = document.getElementById("content");
  return tabbrowser.getWindowTitleForBrowser(tabbrowser.mCurrentBrowser);
},

get tabTitle() {
  var tabbrowser = document.getElementById("content");
  return tabbrowser.mCurrentBrowser.contentTitle;
},

init: function()
{
  var brandbundle = document.getElementById("bundle_brand");
  if (nightly.variables.name==null)
  {
    nightly.variables.name=brandbundle.getString("brandShortName");
  }
  nightly.variables.brandname=brandbundle.getString("brandFullName");
  nightly.variables.defaulttitle=nightlyApp.storedTitle;

  var tabbrowser = document.getElementById("content");
  nightlyApp.oldUpdateTitlebar = tabbrowser.updateTitlebar;

  tabbrowser.updateTitlebar = nightly.updateTitlebar;
  tabbrowser.addEventListener("DOMTitleChanged", nightly.updateTitlebar, false);
},

openURL: function(url)
{
  gBrowser.selectedTab = gBrowser.addTab(url);
},

openNotification: function(id, message, label, accessKey, callback) {
  var action = {
    label: label,
    callback: callback,
    accessKey: accessKey
  };
  if (typeof PopupNotifications != "undefined") {
    var options = {
      timeout: Date.now() + 10000
    };

    PopupNotifications.show(gBrowser.selectedBrowser, id,
      message, "urlbar", action, null, options);
  } else {
    let nb = gBrowser.getNotificationBox();

    nb.appendNotification(
      message, id,
      "chrome://nightly/content/brand/icon.png",
      nb.PRIORITY_INFO_HIGH, [ action ]);
  }
},

setCustomTitle: function(title)
{
  document.getElementById("content").ownerDocument.title = title;
},

setStandardTitle: function()
{
  var tabbrowser = document.getElementById("content");
  nightlyApp.oldUpdateTitlebar.call(tabbrowser);
}

}
