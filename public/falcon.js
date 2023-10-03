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

