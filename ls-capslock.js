; (function (document, window, commonjs) {
    var _isCapsPressed = false,
        _position = null,
        _customClasses = null;

    function setMessagePosition(element, parent, position) {
        var position = element.dataset.lsPosition || position || 'bottom';

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
            if (message.className.indexOf('ls-capslock-message-showed') !== -1) return;

            message.classList.add('ls-capslock-message-showed');
        } else {
            if (message.className.indexOf('ls-capslock-message-showed') === -1) return;

            message.classList.remove('ls-capslock-message-showed');
        }

        setMessagePosition(message, element, _position);

        if (message.className.indexOf(_customClasses) !== -1) return;

        for (var i = 0; i < _customClasses.length; i++) {
            var nc = _customClasses[i] || '';
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
        var isInputText = element instanceof HTMLInputElement && element.type == 'text';

        if (!isInputText) throw 'Element must be a valid text input!';

        if (element.className.indexOf('ls-capslock') !== -1) return;

        element.classList.add('ls-capslock-input');

        element.parentNode.classList.add('ls-capslock');

        var messageNode = document.createElement('div');
        messageNode.classList.add('ls-capslock-message');
        messageNode.innerText = element.dataset.lsCapslockMessage || message || 'Caps Lock is pressed!';

        element.parentNode.insertBefore(messageNode, element.nextSibling);

        element.addEventListener('keydown', keyDownHandler);
        element.addEventListener('click', mouseClickHandler);
        element.addEventListener('focus', onFocusHandler);
        element.addEventListener('blur', blurHandler);
        document.addEventListener('keydown', docKeyDownHandler);

        _customClasses = customClasses.split(' ');
        _position = position;
    };

    /* 
        Setup the elments actions and properties.
        
        Usage: ls_capslock.init(options, message);

        Possibles arguments:
            string id, string message, customClasses, position
            HTMLInputElement element, string message, customClasses, position
            HTMLCollection elements, string message, customClasses, position
            Array of HTMLInputElements elements, string message, customClasses, position
            Object where object must be:
                HTMLInputElement object.element
                string           object.message
                string           object.customClasses
                string           object.position
            Array of Objects where each object must be:
                HTMLInputElement object.element
                string           object.message
                string           object.customClasses
                string           object.position

        The 'message' property is optional in all this configurations, 
        where default value is: 'Caps Lock is pressed!'. You can use HTML5 dataset
        directly on input element like this: '<input type="text" data-ls-capslock-message="Message here!" />'
        and this attribute will be priority when message is setting up.

        The 'customClasses' property is optional in all this configurations, 
        where default value is: null. You can use HTML5 dataset
        directly on input element like this: '<input type="text" data-ls-custom-classes="class1 class2" />'
        and this attribute will be priority when customClasses is setting up.
        This property can be used to customize the style of message.

        The 'position' property is optional in all this configurations, 
        where default value is: 'bottom'. You can use HTML5 dataset
        directly on input element like this: '<input type="text" data-ls-position="top" />'
        and this attribute will be priority when position is setting up.
    */
    var ls_capslock = {
        init: function (options, message, customClasses, position) {
            if (options instanceof String || typeof options == 'string') {
                var element = null,
                    id = options;

                if (id.indexOf('#') !== -1)
                    element = document.getElementById(id);

                if (id.indexOf('.') !== -1)
                    element = document.getElementsByClassName(id);

                options = element || document.getElementsByTagName(id);

                ls_capslock.init(options, message, customClasses, position);
            } else if (options instanceof HTMLInputElement) {
                setUpElement(options, message, customClasses, position);
            } else if (options instanceof Array || options instanceof HTMLCollection) {
                for (var i = 0; i < options.length; i++) {
                    var element = options[i];

                    if (element instanceof HTMLInputElement) {
                        setUpElement(element, message || '', customClasses || '', position || '');
                    } else {
                        position = element.position || position || '';
                        customClasses = element.customClasses || customClasses || '';
                        message = element.message || message || '';
                        element = element.element;

                        setUpElement(element, message, customClasses, position);
                    }
                }
            } else if (!!options.element) {
                setUpElement(options.element,
                    options.message || message || '',
                    options.customClasses || customClasses || '',
                    options.position || position || '');
            }
        }
    };

    if (!!commonjs) {
        module.export = ls_capslock;
    } else {
        window.ls_capslock = ls_capslock;
    }

})(document, window, typeof (exports) !== "undefined");