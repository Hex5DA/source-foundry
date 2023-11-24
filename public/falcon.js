const jsNameRgx = /\[\s*([a-zA-Z_$]?|[\w$]*)\s*\]/g;

window.$all = selector => document.querySelectorAll(selector);
window.$ = selector => document.querySelector(selector);

const HTMLPositions = {
    beforeBegin: "beforebegin",
    afterBegin: "afterbegin",
    beforeEnd: "beforeend",
    afterEnd: "afterend",
};

Element.prototype.$html = function(pos, lit) {
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

Element.prototype.$template = function(ctx) {
    this.outerHTML = _template(this.outerHTML, ctx);
};

Element.prototype.$retemplate = function(ctx) {
    if (this.$_templateReal) this.$_templateReal.remove();
    this.$html(HTMLPositions.afterEnd, _template(this.outerHTML, ctx));
    this.$_templateReal = this.nextElementSibling;

    _removeIdentifiable(this.$_templateReal);
    this.$_templateReal.style.display = "revert";
    this.style.display = "none";
};

Element.prototype.$templateClone = function(ctx, attrs = {}) {
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
        this.value = value;
    }
}

function _prim2obj(prim) {
    switch (typeof prim) {
        case "boolean": return new Boolean(prim);
        case "number": return new Number(prim);
        case "string": return new String(prim);
        case "symbol": return new Symbol(prim);
        case "bigint": return new BigInt(prim);
        case "undefined": return undefined;
        case "object":
        case "function":
            return null;
    }
}

// var o = [..]
// var h = { set(a) { console.log("setted: ", arguments); return Reflect.set(...arguments); } }
// var p = new Proxy(o, h)

window._stateEvents = {};

function _hash(state) {
    const hash = [state.__path ?? "root"];
    let current = state;
    while (current.__parent && (current = current.__parent) !== null) {
        hash.push(current.__path ?? "root");
    }
    return hash.reverse().join("/");
}

function _eventify(obj) {
    const id = _hash(obj);
    if (!(id in window._stateEvents))
        window._stateEvents[id] = new EventTarget();

    Object.defineProperties(obj, {
        addEventListener: {
            value: (...args) => {
                window._stateEvents[id].addEventListener(...args);
            }
        },
        dispatchEvent: {
            value: (...args) => {
                window._stateEvents[id].dispatchEvent(...args);
            }
        },
    });

    return obj; // TODO: maybe don't
}

/*
function $createState(target, parent=null, path=null) {
    if (!(target instanceof Object))
        throw Error("can only create state on objects.");

    let state = { __parent: parent, __path: path };
    for (let [key, value] of Object.entries(target)) {
        const shadow = _prim2obj(value) ?? $createState(value, state, key);

        _eventify(shadow);
        Object.defineProperty(state, "__" + key, {
            value: shadow,
            enumerable: false,
            configurable: true,
        });

        Object.defineProperty(state, key, {
            set(newValue) {
                const stated = _eventify(_prim2obj(newValue) ?? $createState(newValue, state, key));
                Object.defineProperty(state, "__" + key, { value: stated });
                state["__" + key].dispatchEvent(new CustomEvent("$change"));
            },
            get() {
                return state["__" + key];
            },
            enumerable: true,
            configurable: true,
        });
    }

    return state;
}
*/

function _proxify(target) {
    return new Proxy(target, {
        set(obj, prop, value) {
            // console.log("SETTER: ", ...arguments);
            obj[prop].dispatchEvent(new CustomEvent("$change"));
            return Reflect.set(...arguments);
        }
    });
}

function $createState(target, parent=null, path=null) {
    for (const [key, entry] of Object.entries(target)) {
        if (entry instanceof Object) {
            target[key] = $createState(entry, target, key);
            target.__parent = parent;
            target.__path = path;
        }
    }

    return _proxify(_eventify(target));
}

// TODO: look at using Object.setPrototypeOf(obj, EventTarget) instead of wrapping in EventTargets
//       would mean the original object & properties are intact 
//       TODO: how does this impact objects with a previously set prototype? can we merge / extend the prototypes?

// BEHAVIOUR
// - pass in any object / primitive
// - register event listeners for `$create`, `$read`, `$update` and `$delete` events
// - register events on sub-objects
// - events on sub-objects bubble up
// - re-assigning the root value need not trigger an event

function _event(target, eventName) {
    if (!target["addEventListener"]) throw Error("`$event` should only be called on objects with event support.");

    return {
        dispatch: function(event) {
            return target.dispatchEvent(event);
        },
        /** @param {function(Event): void} handler */
        set on(handler) {
            target.addEventListener(eventName, handler)
        }
    };
}

function $objEvent(obj, eventName) {
    return _event(obj, eventName);
}

const _registerEvents = cls => cls.prototype.$event = function(eventName) { return _event(this, eventName); };
//_registerEvents(Document);
//_registerEvents(Window);
//_registerEvents(HTMLElement);
_registerEvents(EventTarget);
_registerEvents($State);

