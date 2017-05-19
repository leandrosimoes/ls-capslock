# LS CAPSLOCK
Simple JS library to show an notification that the caps lock is pressed. Useful for password inputs.

### How to install?

`bower install ls-capslock --save` 

then just put the `ls-capslock.js` and `ls-capslock.css` into your page.

### How to use?

```javascript
/* 
    Setup the elments actions and properties.
    
    Usage: ls_capslock.init(options);

    Possibles arguments:
        options = {
            element, [string element id, string element class, HTMLInputElement, HTMLCollection, Array of HTMLInputElement] [REQUIRED]
            message, [string] [OPTIONAL] [DEFAULT 'Caps Lock is pressed!']
            customClasses, [Array of string] [OPTIONAL] [DEFAULT NULL]
            position [string (top, bottom, left, right)] [OPTIONAL] [DEFAULT 'bottom']
        }
*/
ls_capslock.init({
    element: '#sample-capslock-input',
    message: 'If you are seen this message, your caps lock is activated!',
    customClasses: ['customClass1', 'customClass2'],
    position: 'bottom'
});
```

### Contribute

Any sugestion or bug report, just open a PR on develop branch or mail me at [leandro.simoes@outlook.com](mailto:leandro.simoes@outlook.com)
