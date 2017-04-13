; (function (document, window, commonjs) {
    var isCapsPressed = false;

    function setMessagePosition(element, parent) {
        var position = element.dataset.lsPosition || 'top';

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
                element.style.bottom = (parent.offsetBottom) + 'px';
                element.style.left = (parent.offsetLeft - element.offsetWidth) + 'px';
                break;
            case 'right':
                element.style.bottom = (parent.offsetBottom) + 'px';
                element.style.left = (parent.offsetRight) + 'px';
                break;
        }

        return element;
    };

    function showMessage(element, show) {
        if (!element) return;

        var message = element.nextSibling;

        if (!message) return;

        if (message.className.indexOf('ls-capslock-message') === -1) return;

        message = setMessagePosition(message, element);

        if (!!show) {
            if (message.className.indexOf('ls-capslock-message-showed') !== -1) return;

            message.classList.add('ls-capslock-message-showed');
        } else {
            if (message.className.indexOf('ls-capslock-message-showed') === -1) return;

            message.classList.remove('ls-capslock-message-showed');
        }
    };

    function startKeyDownHandler(e, callback) {
        if (!!e.getModifierState) {
            isCapsPressed = e.getModifierState && e.getModifierState('CapsLock');
        } else {
            var kc = e.keyCode ? e.keyCode : e.which,
                sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);

            isCapsPressed = ((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk);
        }

        !!callback && typeof callback == 'function' && callback();
    }

    function keyDownHandler(e) {
        var self = this;
        startKeyDownHandler(e, function () {
            showMessage(self, isCapsPressed);
        });
    };

    function docKeyDownHandler(e) {
        startKeyDownHandler(e);
    };

    function mouseClickHandler(e) {
        if (!e.getModifierState) return;

        isCapsPressed = e.getModifierState && e.getModifierState('CapsLock');

        showMessage(this, isCapsPressed);
    };

    function blurHandler(e) {
        showMessage(this, false);
    };

    function onFocusHandler(e) {
        showMessage(this, isCapsPressed);
    }

    function setUpElement(element, message) {
        var isInputText = element instanceof HTMLInputElement && element.type == 'text';

        if (!isInputText) throw 'Element must be a valid text input!';

        if (element.className.indexOf('ls-capslock') !== -1) return;

        element.classList.add('ls-capslock');

        var messageNode = document.createElement('div');
        messageNode.classList.add('ls-capslock-message');
        messageNode.innerText = element.dataset.lsCapslockMessage || message || 'Caps Lock is pressed!';

        element.parentNode.insertBefore(messageNode, element.nextSibling);

        element.addEventListener('keydown', keyDownHandler);
        element.addEventListener('click', mouseClickHandler);
        element.addEventListener('focus', onFocusHandler);
        element.addEventListener('blur', blurHandler);
        document.addEventListener('keydown', docKeyDownHandler);
    };

    /* 
        Setup the elments actions and properties.
        
        Usage: ls_capslock.init(options, message);

        Possibles arguments:
            string id, string message
            HTMLInputElement element, string message
            HTMLCollection elements, string message
            Array of HTMLInputElements elements, string message
            Object where object must be:
                HTMLInputElement object.element
                string           object.message
            Array of Objects where each object must be:
                HTMLInputElement object.element
                string           object.message

        The 'message' property is optional in all this configurations, 
        where default value is: 'Caps Lock is pressed!'. You can use HTML5 dataset
        directly on input element like this: '<input type="text" data-ls-capslock-message="Message here!" />'
        and this attribute will be priority when message is setting up.
    */
    var ls_capslock = {
        init: function (options, message) {
            if(options instanceof String || typeof options == 'string') {
                var element = null,
                    id = options;

                if(id.indexOf('#') !== -1)
                    element = document.getElementById(id);

                if(id.indexOf('.') !== -1)
                    element = document.getElementsByClassName(id);

                options = element || document.getElementsByTagName(id);

                ls_capslock.init(options, message);
            } else if(options instanceof HTMLInputElement) {
                setUpElement(options, message);
            } else if(options instanceof Array || options instanceof HTMLCollection) {
                for (var i = 0; i < options.length; i++) {
                    var element = options[i];

                    if(element instanceof HTMLInputElement) {
                        setUpElement(element, message || '');                        
                    } else {
                        message = element.message || message || '';
                        element = element.element;

                        setUpElement(element, message);
                    }
                }
            } else if(!!options.element) {
                setUpElement(options.element, options.message || message || '');
            }
        }
    };

    if (!!commonjs) {
        module.export = ls_capslock;
    } else {
        window.ls_capslock = ls_capslock;
    }

})(document, window, typeof (exports) !== "undefined");