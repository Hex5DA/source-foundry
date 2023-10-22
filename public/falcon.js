const jsNameRgx = /\[\s*([a-zA-Z_$]?|[\w$]*)\s*\]/g;

window.$all = selector => document.querySelectorAll(selector);
window.$ = selector => document.querySelector(selector);

const HTMLPositions = {
    beforeBegin: "beforebegin",
    afterBegin: "afterbegin",
    beforeEnd: "beforeend",
    afterEnd: "afterend",
};

Element.prototype.$html = function (pos, lit) {
    this.insertAdjacentHTML(pos, lit);
}

function _template(source, ctx) {
    return source.replace(jsNameRgx, (_, cap) => {
        if (!(cap in ctx)) {
            throw Error(`template literal ${cap} was not provided in the given context`);
        }
        return ctx[cap];
    });
}

function _removeIdentifiable(element) {
    element.removeAttribute("id");
}

Element.prototype.$template = function (ctx) {
    this.outerHTML = _template(this.outerHTML, ctx);
};

Element.prototype.$retemplate = function (ctx) {
    if (this.$_templateReal) this.$_templateReal.remove();
    this.$html(HTMLPositions.afterEnd, _template(this.outerHTML, ctx));
    this.$_templateReal = this.nextElementSibling;

    _removeIdentifiable(this.$_templateReal);
    this.$_templateReal.style.display = "revert";
    this.style.display = "none";
};

Element.prototype.$templateClone = function (ctx, attrs={}) {
    this.$html(HTMLPositions.afterEnd, _template(this.outerHTML, ctx));
    _removeIdentifiable(this.nextElementSibling);
    this.nextElementSibling.style.display = "revert";
    this.style.display = "none";

    for (const [key, value] of Object.entries(attrs)) {
        this.nextElementSibling.setAttribute(key, value);
    }
}

class $State extends EventTarget {
    constructor(value) {
        super();
        this.__value = value;
    }

    set value(newValue) {
        this.__value = newValue;
        this.dispatchEvent(new CustomEvent("$change", { detail: this.__value }));
    }
    get value() {
        return this.__value;
    }
}

// [name] gives the value, $[name] gives the `State` object
window.$state = new Proxy({}, {
    set(obj, prop, rec) {
        if (prop in obj) {
            obj[prop].value = rec;
        } else {
            Reflect.set(...arguments);
        }
    },
    get(obj, prop, rec) {
        if (!prop.startsWith("$")) {
            return Reflect.get(...arguments).value;
        } else {
            return Reflect.get(obj, prop.slice(1), rec);
        }
    }
});

function _event(target, eventName) {
    if (!target["addEventListener"]) throw Error("`$event` should only be called on objects with event support.");

    let options = null;
    return {
        dispatch: function (event) {
            return target.dispatchEvent(event);
        },
        remove: function (handler, options) {
            target.removeEventListener(eventName, handler, options);
        },
        opts: function (opts) {
            options = opts;
        },
        /** @param {function(Event): void} handler */
        set on(handler) {
            target.addEventListener(eventName, handler, options)
        }
    };
}

function $objEvent(obj, eventName) {
    return _event(obj, eventName);
}

const _registerEvents = cls => cls.prototype.$event = function (eventName) { return _event(this, eventName); };
_registerEvents(Document);
_registerEvents(Window);
_registerEvents(HTMLElement);
_registerEvents($State);

