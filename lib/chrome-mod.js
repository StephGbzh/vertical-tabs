/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {Cc,Ci} = require("chrome");

// traits is going away, closest similarity for dealing with inheritance and mixins are `sdk/core/heritage`
const { Trait } = require('sdk/deprecated/traits');
//const { mix } = require('sdk/core/heritage');
//const { Trait } = require('traits-resurrected');
//console.log(Trait.compose)

//const observers = require("api-utils/observer-service");
var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
const { Worker, Loader } = require('sdk/content/content');

// remplacé par sdk/event/core
const { EventEmitter } = require('sdk/deprecated/events');

const mediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);

/**
 * ChromeMod constructor
 * @constructor
 */
exports.ChromeMod = Loader.compose(EventEmitter, {
  on: EventEmitter.required,
  _listeners: EventEmitter.required,
  contentScript: Loader.required,
  contentScriptFile: Loader.required,
  contentScriptWhen: Loader.required,
  include: null,
  type: null,
  id: null,
  constructor: function ChromeMod(options) {
    this._onNewWindow = this._onNewWindow.bind(this);
    this._onUncaughtError = this._onUncaughtError.bind(this);
    options = options || {};

    if ('contentScript' in options)
      this.contentScript = options.contentScript;
    if ('contentScriptFile' in options)
      this.contentScriptFile = options.contentScriptFile;
    if ('contentScriptWhen' in options)
      this.contentScriptWhen = options.contentScriptWhen;
    if ('onAttach' in options)
      this.on('attach', options.onAttach);
    if ('onError' in options)
      this.on('error', options.onError);

    function normalize(strOrArray) {
      if (Array.isArray(strOrArray))
        return strOrArray;
      else if (strOrArray)
        return [strOrArray];
      else
        return [];
    }
    this.include = normalize(options.include);
    this.type = normalize(options.type);
    this.id = normalize(options.id);

    chromeModManager.on("new-window", this._onNewWindow);
  },

  destroy: function destroy() {
    chromeModManager.removeListener("new-window", this._onNewWindow);
  },

  _compareStringWithArrayOfStringRegexp : function(array, str) {
    // Accept any on wild card
    if (array.length==1 && array[0]=="*") return true;
    // Attribute may be null, we should not accept them.
    if (!str) return false;
    for(let i=0, l=array.length; i<l; i++) {
      let rule = array[i];
      if (typeof rule=="RegExp" && rule.test(str))
        return true;
      else if (typeof rule=="string" && rule==str)
        return true;
    }
    return false;
  },

  _onNewWindow: function _onNewWindow(window) {
    // Match windows either on document location, window type or window id
    if (!this._compareStringWithArrayOfStringRegexp(this.include, 
          window.document.location.href) &&
        !this._compareStringWithArrayOfStringRegexp(this.type,
          window.document.documentElement.getAttribute("windowtype")) &&
        !this._compareStringWithArrayOfStringRegexp(this.id,
          window.document.documentElement.getAttribute("id")) ) 
      return;

    this._emit('attach', Worker({
      window: window.wrappedJSObject,
      contentScript: this.contentScript,
      contentScriptFile: this.contentScriptFile,
      onError: this._onUncaughtError
    }));
  },

  _onUncaughtError: function _onUncaughtError(e) {
    if (this._listeners('error').length == 0)
      console.exception(e);
    //else
    //  this._emit("error", e);
  }
});

const ChromeModManager = Trait.compose(
//const ChromeModManager = mix(

  EventEmitter.resolve({
    on: '_on'
  })
  //EventEmitter{}
  , {
  


  constructor: function PageModRegistry() {
    /*observers.add(
      "chrome-document-global-created", 
      this._onDocumentGlobalCreated = this._onDocumentGlobalCreated.bind(this)
    );*/
  },

  _destructor: function _destructor() {
    /*observers.remove(
      "chrome-document-global-created", 
      this._onDocumentGlobalCreated
    );*/
    // Empty EventEmitter
    this._removeAllListeners();
  },

  _onDocumentGlobalCreated: function _onDocumentGlobalCreated(window) {

    // Emit an event immediatly if document is already loaded,
    // else wait for its to be ready
    if (window.document && window.document.readyState == "complete") {
      this._emit("new-window", window);
      return;
    }

    let self = this;
    window.addEventListener("DOMContentLoaded", function load() {
      window.removeEventListener("DOMContentLoaded", load, true);
      self._emit("new-window", window);
    }, true);
  },

  on: function (name, callback) {
      //console.log(this._on);
      //console.log("***on*** "+this["on"]);
      //console.log("***_on*** "+this["_on"]);
    this._on(name, callback);
    if (name != "new-window")
      return;

    // Emit all existing windows on listener registration
    let winEnum = mediator.getXULWindowEnumerator(null);
    while (winEnum.hasMoreElements()){
      let win = winEnum.getNext();

      if(!(win instanceof Ci.nsIXULWindow))
        continue;

      let docShellEnum = win.docShell.getDocShellEnumerator(
        Ci.nsIDocShellTreeItem.typeAll, 
        Ci.nsIDocShell.ENUMERATE_FORWARDS);

      while(docShellEnum.hasMoreElements()) {
        let docShell = docShellEnum.getNext();
        if(docShell instanceof Ci.nsIDocShell) {
          let domDocument = docShell.contentViewer.DOMDocument;
          let domWindow = domDocument.defaultView;
          callback(domWindow);
        }
      }
    }

  }

});
//console.log("***on*** "+ChromeModManager["on"]);
//console.log("***_on*** "+ChromeModManager["_on"]);
//console.log(Trait.compose);
const chromeModManager = ChromeModManager();