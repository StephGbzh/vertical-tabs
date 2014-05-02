var {Cu, Cc, Ci} = require("chrome");
AddonManager = Cu.import("resource://gre/modules/AddonManager.jsm").AddonManager;

var self = require("self");
/*
AddonManager.getAddonByID(self.id, function(addon) {
// Include some utility functions
//include(addon.getResourceURI("includes/utils.js").spec);
// Remember some image's url
//img = addon.getResourceURI("images/star.png").spec;
//console.log(addon.name)
//loadStyles(addon);
    console.log("c1");
let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    console.log("c2");
    let fileURI = addon.getResourceURI("data/main.css");
        console.log("c3");
    sss.loadAndRegisterSheet(fileURI, sss.USER_SHEET);
    console.log("c4");

});*/


    console.log("c1");
let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    console.log("c2");
    sss.loadAndRegisterSheet(self.data.url("main.css"), sss.USER_SHEET);
    console.log("c3");


function loadStyles(addon) {
  let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);

    let fileURI = addon.getResourceURI("main.css");
    sss.loadAndRegisterSheet(fileURI, sss.USER_SHEET);
    //unload(function() sss.unregisterSheet(fileURI, sss.USER_SHEET));

}


var winUtils = require("window-utils");

winUtils = new winUtils.WindowTracker({
  onTrack: function (window) {
	if ("chrome://browser/content/browser.xul" != window.location) return;
	var browser = window.document.getElementById("browser");
	var TabsToolbar = window.document.getElementById("TabsToolbar");
	browser.appendChild(TabsToolbar);
	tabBrowser = window.document.getElementById("content");
	tabBrowser.mTabContainer.mTabstrip.setAttribute("orient", "vertical");
  },
  onUntrack: function (window) {
  }
});
