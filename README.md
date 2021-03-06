#Vertical tabs

Vertical tabs is a Firefox add-on aimed at putting the tabs in a sidebar placed on the right of the browser.  
It is __NOT__ this add-on: [Vertical Tabs](https://addons.mozilla.org/en-Us/firefox/addon/vertical-tabs/)

I developed this because [Widefox](https://sites.google.com/site/jrweare/browser2.0) has been abandoned around Firefox 3.  
[Tab Mix Plus](https://addons.mozilla.org/en-US/firefox/addon/tab-mix-plus/) developers never added this functionality either, see [Tab Mix Plus Forum](http://tmp.garyr.net/forum/viewtopic.php?t=17110).

It is light-weight and can be complemented with other addons:
- [Classic Theme Restorer](https://addons.mozilla.org/en-US/firefox/addon/classicthemerestorer/) allows "Squared tabs" much more covenient for a vertical tab bar.
- [Tab Wheel Scroll](https://addons.mozilla.org/en-US/firefox/addon/tab-wheel-scroll/) allows... well, just take a guess :-)

###version 0.9

Fixed css to work correctly on Windows  

###version 0.8

Modified to work with firefox 29  
Replaced deprecated API (traits and window-utils)  
Repackaged with addon sdk 1.16  

###version 0.7

Repackaged with addon sdk 1.14

###version 0.6

- lib/chrome-mod.js
- lib/main.js
- data/main.css
- data/browser.css
- data/browser-mod.js

Full screen: hide tab bar and window control buttons  
Full screen: show tab bar when the mouse cursor touches the right side of screen

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
