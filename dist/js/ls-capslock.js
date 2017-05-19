; (function (document, window, commonjs) {
    var _isCapsPressed = false,
        _position = null,
        _customClasses = null;

    function setMessagePosition(element, parent, position) {
        switch (position) {
            case 'top':
                element.style.top = (parent.offsetTop - element.offsetHeight) + 'px';
                element.style.left = (parent.offsetLeft) + 'px';
                break;
            case 'bottom':
                element.style.top = (parent.offsetTop + parent.offsetHeight) + 'px';
                element.style.left = (parent.offsetLeft) + 'px';
                break;
            case 'left':
                element.style.top = (parent.offsetTop) + 'px';
                element.style.left = (parent.offsetLeft - element.offsetWidth) + 'px';
                break;
            case 'right':
                element.style.top = (parent.offsetTop) + 'px';
                element.style.left = (parent.offsetLeft + parent.offsetWidth) + 'px';
                break;
        }
    };

    function showMessage(element, show) {
        if (!element) return;

        var message = element.nextSibling;

        if (!message) return;

        if (message.className.indexOf('ls-capslock-message') === -1) return;

        if (!!show) {
			if (element.className.indexOf('ls-capslock-active') === -1) {
				element.classList.add('ls-capslock-active');
			}
			
            if (message.className.indexOf('ls-capslock-message-showed') === -1) {
				message.classList.add('ls-capslock-message-showed');	
			}
        } else {
			if (element.className.indexOf('ls-capslock-active') !== -1) {
				element.classList.remove('ls-capslock-active');
			}
			
            if (message.className.indexOf('ls-capslock-message-showed') !== -1) {
				message.classList.remove('ls-capslock-message-showed');	
			}
        }

        setMessagePosition(message, element, _position);

        if (message.className.indexOf(_customClasses) !== -1) return;

        for (var i = 0; i < _customClasses.length; i++) {
            var nc = _customClasses[i];
            message.classList.add(nc.trim());
        }
    };

    function startKeyDownHandler(e, callback) {
        if (!!e.getModifierState) {
            _isCapsPressed = e.getModifierState && e.getModifierState('CapsLock');
        } else {
            var kc = e.keyCode ? e.keyCode : e.which,
                sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);

            _isCapsPressed = ((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk);
        }

        !!callback && typeof callback == 'function' && callback();
    }

    function keyDownHandler(e) {
        var self = this;
        startKeyDownHandler(e, function () {
            showMessage(self, _isCapsPressed);
        });
    };

    function docKeyDownHandler(e) {
        startKeyDownHandler(e);
    };

    function mouseClickHandler(e) {
        if (!e.getModifierState) return;

        _isCapsPressed = e.getModifierState && e.getModifierState('CapsLock');

        showMessage(this, _isCapsPressed);
    };

    function blurHandler(e) {
        showMessage(this, false);
    };

    function onFocusHandler(e) {
        showMessage(this, _isCapsPressed);
    }

    function setUpElement(element, message, customClasses, position) {
        var isInputText = element instanceof HTMLInputElement && (element.type == 'text' || element.type == 'password' || element.type == 'email' || element.type == 'search' || element.type == 'url');

        if (!isInputText) throw 'Element must be a valid text input!';

        if (element.className.indexOf('ls-capslock') !== -1) return;

        element.classList.add('ls-capslock-input');

        element.parentNode.classList.add('ls-capslock');

        var messageNode = document.createElement('div');
        messageNode.classList.add('ls-capslock-message');
        messageNode.innerText = message;

        element.parentNode.insertBefore(messageNode, element.nextSibling);

        element.addEventListener('keydown', keyDownHandler);
        element.addEventListener('click', mouseClickHandler);
        element.addEventListener('focus', onFocusHandler);
        element.addEventListener('blur', blurHandler);
        document.addEventListener('keydown', docKeyDownHandler);

        _customClasses = customClasses;
        _position = position;
    };

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
    var ls_capslock = {
		init: function (options) {
			options = options || {};
			
			// Define default properties
			options.message = options.message || 'Caps Lock is pressed!';
			options.customClasses = options.customClasses || [];
			options.position = options.position || 'bottom';
			
			if(!options.element) throw 'The "element" options is required';
			
			if(options.element instanceof String || typeof options.element === 'string') {
				var element = null,
                    id = options.element;

                if (id.indexOf('#') !== -1) //Was provided an ID to find the element
                    element = document.getElementById(id.replace('#', ''));

                if (id.indexOf('.') !== -1) //Was provided a class to find the elements
                    element = document.getElementsByClassName(id.replace('.', ''));
			
				options.element = element || document.getElementsByTagName(id); //Was provided an element tag to find the elements

                window.ls_capslock.init(options);
				
				return;
			}
			
			if(options.element instanceof HTMLInputElement) {
				setUpElement(options.element, options.message, options.customClasses, options.position);
				
				return;
			}
			
			if(options.element instanceof Array || options.element instanceof HTMLCollection) {
				for (var i = 0; i < options.element.length; i++) {
                    var element = options.element[i];

                    if (element instanceof HTMLInputElement) {
                        setUpElement(element, options.message, options.customClasses, options.position);
                    } else {
                        options.element = element;
						window.ls_capslock.init(options);
                    }
                }
				
				return;
			}
			
			// Not match by any valid type of element
			throw 'Element must be a valid text input!';
		}
    };

    if (!!commonjs) {
        module.export = ls_capslock;
    } else {
        window.ls_capslock = ls_capslock;
    }

})(document, window, typeof (exports) !== "undefined");