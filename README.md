#Vertical tabs

Vertical tabs is a Firefox add-on aimed at putting the tabs in a sidebar placed on the right of the browser.  
It is __NOT__ this add-on: [Vertical Tabs](https://addons.mozilla.org/en-Us/firefox/addon/vertical-tabs/)

I developed this because [Widefox](https://sites.google.com/site/jrweare/browser2.0) was abandoned around Firefox 3.  
[Tab Mix Plus](https://addons.mozilla.org/en-US/firefox/addon/tab-mix-plus/) developers never added this functionality either, see http://tmp.garyr.net/forum/viewtopic.php?t=17110

###version 0.5

- lib/chrome-mod.js
- lib/main.js
- data/main.css
- data/browser.css
- data/browser-mod.js

Bugs revealed by "cfx test" corrected  
Add code to read the window dimensions before and after the main code  
  => resolves the problem of window width exploding (by what magic?!)

###version 0.4

- lib/chrome-mod.js
- lib/main.js
- data/main.css
- data/browser.css
- data/browser-mod.js

Adapted to firefox 17 which added tabs animation during drag and drop

###version 0.3

- lib/chrome-mod.js
- lib/main.js
- data/main.css
- data/browser.css
- data/browser-mod.js

tab.png removed  
tab drop indicator modified: more readable

###version 0.2

- lib/chrome-mod.js
- lib/main.js
- data/main.css
- data/browser.css
- data/browser-mod.js
- data/tab.png

Based on the treetabs version of ochameau  
https://github.com/mozilla/addon-sdk/wiki/Community-developed-modules
- drag and drop added

###version 0.1

- lib/main.js
- data/main.css

Equivalent to my version of VertTabBar :
- tabs on the right
- buttons "tab list" and "new Tab" removed
- no drag and drop
