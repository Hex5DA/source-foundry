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


globalThis.$storage = {};

/*
function $createState(target) {
    if (!(target instanceof Object)) target = $prim2obj(target);

    let proxyTarget = {};
    for (const [key, value] of Object.entries(target)) {
        if (value instanceof Object) {
            proxyTarget[key] = new EventTarget($createState(value));
        } else {
            proxyTarget["__" + key] = new EventTarget(value);
            Object.defineProperty(proxyTarget, key, {
                get: () => proxyTarget["__" + key],
                set: newValue => {
                    proxyTarget["__" + key].target = newValue;
                    proxyTarget["__" + key].dispatchEvent(new CustomEvent("change"));
                },
                enumerable: true,
            });
        }
    }

    return proxyTarget;
}
*/

function $createState(target) {
    if (!(target instanceof Object))
        throw Error("can only create state on objects.");

    let r = {};
    for (let [key, value] of Object.entries(target)) {
        if (value instanceof Object) {
            value = $createState(value);
            value = Object.assign(new EventTarget(), value);
        }
        // console.log(key, value);

        const shadow = value;
        console.log("shadow:", shadow);
        Object.defineProperty(r, "__" + key, {
            value: shadow,
            enumerable: false,
        });

        Object.defineProperty(r, key, {
            set(nv) {
                // console.log("write");
                r["__" + key] = nv;
            },
            get() {
                // console.log("read", key);
                return r["__" + key];
            },
            enumerable: true,
            configurable: true,
        });
    }
    return r;
}   

// NEW:
// - define setters for everything 

// TODO: look at using Object.setPrototypeOf(obj, EventTarget) instead of wrapping in EventTargets
//       would mean the original object & properties are intact 
//       TODO: how does this impact objects with a previously set prototype? can we merge / extend the prototypes?

// BEHAVIOUR
// - pass in any object / primitive
// - register event listeners for `$create`, `$read`, `$update` and `$delete` events
// - register events on sub-objects
// - events on sub-objects bubble up
// - re-assigning the root value need not trigger an event

// - recursive proxy
// - ditch $state
// ? batch updates (observableslim style - DOM manip)
// ? events for CRUD

// RECURSIVE PROXY
// - if value is object:
//   - proxy the object
//   - if any properties are objects, recurse
// - else:
//   - proxy a dummy, invisible object

// PROXY
// - on set
//   - if attribute exists, issue change event
//   - if attriute does not exist, issue add event
// ? on delete / on get

// EVENTS
// - every child object is an eventtarget
// ? dummy proxies are eventtargets too

// DUMMIES
// - 

function _event(target, eventName) {
    if (!target["addEventListener"]) throw Error("`$event` should only be called on objects with event support.");

    let options = null;
    return {
        dispatch: function(event) {
            return target.dispatchEvent(event);
        },
        remove: function(handler, options) {
            target.removeEventListener(eventName, handler, options);
        },
        opts: function(opts) {
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

const _registerEvents = cls => cls.prototype.$event = function(eventName) { return _event(this, eventName); };
//_registerEvents(Document);
//_registerEvents(Window);
//_registerEvents(HTMLElement);
_registerEvents(EventTarget);
_registerEvents($State);

