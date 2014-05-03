"use strict";

const { Ci, Cc } = require("chrome");
const { ChromeMod } = require("chrome-mod");

const { windows, isDocumentLoaded } = require('sdk/window/utils');
const { isGlobalPBSupported } = require('sdk/private-browsing/utils');
const { isPrivateBrowsingSupported } = require('self');

/* Tests for the ChromeMod APIs */

exports.testChromeMod = function(test) {
  test.waitUntilDone();

  let chromeMod = new ChromeMod({
    type: "navigator:browser",

    contentScript: 'new ' + function WorkerScope() {
      document.documentElement.setAttribute("chrome-mod-ok", "true");
      self.on("message", function (data) {
        if (data=="hi")
          self.postMessage("bye");
      });
    },

    onAttach: function(worker) {
        // getWindows() and windowIterator() are copied from deprecated/window-utils (+their dependencies above)
        function getWindows() windows(null, { includePrivate: isPrivateBrowsingSupported || isGlobalPBSupported });
        function windowIterator() {
          // Bug 752631: We only pass already loaded window in order to avoid
          // breaking XUL windows DOM. DOM is broken when some JS code try
          // to access DOM during "uninitialized" state of the related document.
          let list = getWindows().filter(isDocumentLoaded);
          for (let i = 0, l = list.length; i < l; i++) {
            yield list[i];
          }
        };
        
      worker.on("message", function (data) {
        test.assertEqual(data, "bye", "get message from content script");
        // Search for this modified window
        /*for(let win in utils.windows()) {
            console.log("WINDOW COUCOU1 "+ win)
        }*/
        for(let win in windowIterator()) {
            console.log("WINDOW COUCOU "+ win)
          if (win.document.documentElement.getAttribute("chrome-mod-ok") == "true") {
            test.done();
            return;
          }
        }
        test.fail("Unable to found the modified window, with 'chrome-mod-ok' attribute");
      });
      worker.postMessage("hi");
    }
  });

};
