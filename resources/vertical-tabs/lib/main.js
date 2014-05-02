var {Cc, Ci} = require("chrome");
var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);

var self = require("self");

// Build an internal URI to "data/main.css"
var uri = ios.newURI(self.data.url("main.css"), null, null);

// Apply CSS
sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

const { ChromeMod } = require("chrome-mod");

ChromeMod({
  type: "navigator:browser",

  contentScriptFile: require("self").data.url("browser-mod.js"),
  contentScript: 'new ' + function WorkerScope() {
    self.on('message', function (data) {
      // Register custom css file
      // Alternative: https://developer.mozilla.org/en/Using_the_Stylesheet_Service
      if (data.msg=="css") {
        var stylepi = document.createProcessingInstruction(
          'xml-stylesheet', 
          'href="'+data.url+'" type="text/css"');
        document.insertBefore(stylepi, document.documentElement)
      }
    });
  },
  onAttach: function(worker) {
    worker.on("message", function (data) {

    });
    
    worker.postMessage({
      msg: "css",
      url: require("self").data.url('browser.css')
    });
    
  }
});
