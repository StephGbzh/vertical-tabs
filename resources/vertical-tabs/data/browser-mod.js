var browser = document.getElementById("browser");
var tabsToolbar = document.getElementById("TabsToolbar");
browser.appendChild(tabsToolbar);
tabBrowser = document.getElementById("content");
tabBrowser.mTabContainer.mTabstrip.setAttribute("orient", "vertical");

let tabs = document.getElementById('tabbrowser-tabs');


// Change tabs orientation
tabsToolbar.setAttribute("orient", "vertical");
let orientBox = document.getAnonymousElementByAttribute(tabs, 'anonid', 'arrowscrollbox');
if (orientBox)
  orientBox.setAttribute("orient","vertical");
else
  console.error("unable to found orientbox");


// Overload XBL methods in order to make Drag'n Drop work:
tabs._getDragTargetTab = function _getDragTargetTabTTOverload (event) {
  let tab = event.target.localName == "tab" ? event.target : null;
  if (tab &&
     (event.type == "drop" || event.type == "dragover") &&
      event.dataTransfer.dropEffect == "link") {
   let boxObject = tab.boxObject;
   if (event.screenY < boxObject.screenY + boxObject.height * .25 ||
       event.screenY > boxObject.screenY + boxObject.height * .75)
     return null;
  }
  return tab;
};

tabs._getDropIndex = function _getDropIndexTTOverload (event) {
  var tabs = this.childNodes;
  var tab = this._getDragTargetTab(event);
  if (window.getComputedStyle(this, null).direction == "ltr") {
   for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
     if (event.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height / 2)
       return i;
  } else {
   for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
     if (event.screenY > tabs[i].boxObject.screenY + tabs[i].boxObject.height / 2)
       return i;
  }
  return tabs.length;
};

tabs._setEffectAllowedForDataTransfer = function _setEffectAllowedForDataTransferTTOverload (event) {
  var dt = event.dataTransfer;
  // Disallow dropping multiple items
  if (dt.mozItemCount > 1)
    return dt.effectAllowed = "none";

  var types = dt.mozTypesAt(0);
  var sourceNode = null;
  // tabs are always added as the first type
  if (types[0] == TAB_DROP_TYPE) {
    var sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
    if (sourceNode instanceof XULElement &&
        sourceNode.localName == "tab" &&
        (sourceNode.parentNode == this ||
         (sourceNode.ownerDocument.defaultView instanceof ChromeWindow &&
          sourceNode.ownerDocument.documentElement.getAttribute("windowtype") == "navigator:browser"))) {
      if (sourceNode.parentNode == this &&
          (event.screenY >= sourceNode.boxObject.screenY &&
            event.screenY <= (sourceNode.boxObject.screenY +
                               sourceNode.boxObject.height))) {
        return dt.effectAllowed = "none";
      }

      return dt.effectAllowed = event.ctrlKey ? "copy" : "move";
    }

  }

  if (browserDragAndDrop.canDropLink(event)) {
    // Here we need to do this manually
    return dt.effectAllowed = dt.dropEffect = "link";
  }
  return dt.effectAllowed = "none";
};

function dragOverEvent(event) {
        var effects = this._setEffectAllowedForDataTransfer(event);

        var ind = this._tabDropIndicator;
        if (effects == "" || effects == "none") {
          ind.collapsed = true;
          return;
        }
        event.preventDefault();
        event.stopPropagation();

        var tabStrip = this.mTabstrip;
        var ltr = (window.getComputedStyle(this, null).direction == "ltr");

        // autoscroll the tab strip if we drag over the scroll
        // buttons, even if we aren't dragging a tab, but then
        // return to avoid drawing the drop indicator
        var pixelsToScroll = 0;
        if (this.getAttribute("overflow") == "true") {
          var targetAnonid = event.originalTarget.getAttribute("anonid");
          switch (targetAnonid) {
            case "scrollbutton-up":
              pixelsToScroll = tabStrip.scrollIncrement * -1;
              break;
            case "scrollbutton-down":
              pixelsToScroll = tabStrip.scrollIncrement;
              break;
          }
          if (pixelsToScroll)
            tabStrip.scrollByPixels((ltr ? 1 : -1) * pixelsToScroll);
        }

        if (effects == "link") {
          let tab = this._getDragTargetTab(event);
          if (tab) {
            if (!this._dragTime)
              this._dragTime = Date.now();
            if (Date.now() >= this._dragTime + this._dragOverDelay)
              this.selectedItem = tab;
            ind.collapsed = true;
            return;
          }
        }

        var newIndex = this._getDropIndex(event);
        var dt = event.dataTransfer;
        draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        draggedTab._dragData.animDropIndex = newIndex;
        var scrollRect = tabStrip.scrollClientRect;
        var rect = tabStrip.getBoundingClientRect();
        var minMargin = scrollRect.top - rect.top;
        var maxMargin = Math.min(minMargin + scrollRect.height,
                                 scrollRect.bottom);
        if (!ltr)
          [minMargin, maxMargin] = [this.clientHeight - maxMargin,
                                    this.clientHeight - minMargin];
        var newMargin;
        if (pixelsToScroll) {
          // if we are scrolling, put the drop indicator at the edge
          // so that it doesn't jump while scrolling
          newMargin = (pixelsToScroll > 0) ? maxMargin : minMargin;
        }
        else {
          if (newIndex == this.childNodes.length) {
            let tabRect = this.childNodes[newIndex-1].getBoundingClientRect();
            if (ltr)
              newMargin = tabRect.bottom - rect.top;
            else
              newMargin = rect.bottom - tabRect.top;
          }
          else {
            let tabRect = this.childNodes[newIndex].getBoundingClientRect();
            if (ltr)
              newMargin = tabRect.top - rect.top;
            else
              newMargin = rect.bottom - tabRect.bottom;
          }
        }

        ind.collapsed = false;

        newMargin -= ind.clientHeight / 2;
        if (!ltr)
          newMargin *= -1;
        newMargin -= this.clientHeight;

        //ind.style.MozTransform = "translate(" + this.clientWidth + "px, " + Math.round(newMargin) + "px) rotate(90deg)";
        
        ind.style.MozTransform = "translate(" + this.clientWidth + "px, " + Math.round(newMargin) + "px)";
        
        ind.style.MozMarginStart = (- ind.clientWidth) + "px";
        //ind.style.MozMarginStart = "50px";

// All these properties applies the max value to ALL paddings ! (right, left, top, bottom)
        //ind.style.paddingTop = "10px";
        //ind.style.paddingRight = "100px";
        //ind.style.padding = "1px 1px 1px 250px";
        //ind.style.paddingBottom = "10px";
        //ind.style.paddingLeft = "750px";

        //console.log(ind.style.cssText);
}


tabs.addEventListener("dragover", function (event) {
  try {
    dragOverEvent.call(tabs, event);
    // Avoid XBL dragover handler call
    event.stopPropagation();
  } catch(e) {
    console.exception(e);
  }
}, true);
/*
function dblClickEvent(event) {
        // When the tabbar has an unified appearance with the titlebar
        // and menubar, a double-click in it should have the same behavior
        // as double-clicking the titlebar
        if (TabsInTitlebar.enabled ||
            (TabsOnTop.enabled && this.parentNode._dragBindingAlive)) {
            console.log("1");
          return;
          }

        if (event.button != 0 ||
            event.originalTarget.localName != "box") {
                        console.log("2");
          return;
          }

        // See hack note in the tabbrowser-close-tab-button binding
        if (!this._blockDblClick) {
                    console.log("3");
          BrowserOpenTab();
          }
            console.log("4");
        event.preventDefault();
}

tabs.addEventListener("dblclick", function (event) {
  try {
            console.log("AAAA");
    dblClickEvent.call(tabs, event);
    // Avoid XBL dragover handler call
    event.stopPropagation();
  } catch(e) {
    console.exception(e);
  }
}, true);
*/
