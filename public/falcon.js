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

Element.prototype.$template = function (ctx) {
    this.innerHTML = _template(this.innerHTML, ctx);
};

Element.prototype.$templateClone = function (ctx, attrs={}) {
    this.style.display = "none";
    this.$html(HTMLPositions.afterEnd, _template(this.innerHTML, ctx));
    for (const [key, value] of Object.entries(attrs)) {
        this.nextElementSibling.setAttribute(key, value);
    }
}

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

// window.$event("load").on 
// $event(server, "load").on

function $objEvent(obj, eventName) {
    return _event(obj, eventName);
}

const _registerEvents = cls => cls.prototype.$event = function (eventName) { return _event(this, eventName); };
_registerEvents(Document);
_registerEvents(Window);

