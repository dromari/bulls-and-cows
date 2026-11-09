export function createElement(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'textContent') {
            element.textContent = String(value);
        }
        else if (key === 'className') {
            element.className = String(value);
        }
        else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        }
        else if (value !== undefined && value !== null) {
            element.setAttribute(key, String(value));
        }
    });
    children.forEach((child) => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        }
        else {
            element.appendChild(child);
        }
    });
    return element;
}
//# sourceMappingURL=createElement.js.map