// ------------------------------
// Create Element Utility
// ------------------------------

export function createEl(tag, props = {}, children = []) {
    const isFragment = !tag;
    const el = isFragment
      ? document.createDocumentFragment()
      : document.createElement(tag);
  
    // ----- Props -----
    for (const [key, value] of Object.entries(props)) {
      if (value == null) continue;
  
      if (key === 'dataset') {
        Object.assign(el.dataset, value);
  
      } else if (key === 'style') {
        Object.assign(el.style, value);
  
      } else if (key === 'class') {
        if (Array.isArray(value)) {
          value.filter(Boolean).forEach(cls => el.classList.add(cls));
        } else {
          el.classList.add(value);
        }
  
      } else if (key === 'ref' && typeof value === 'function') {
        value(el);
  
      } else if (key.startsWith('on') && typeof value === 'function') {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, value);
  
      } else if (key === 'text') {
        el.textContent = value;
  
      } else if (typeof value === 'boolean') {
        // Prefer the IDL property when it exists. HTML boolean attributes
        // (disabled, hidden) treat absence as false — but enumerated ones
        // like spellcheck default to ON when the attribute is missing, so
        // removeAttribute would leave spellcheck enabled. Property assign
        // sets spellcheck="false" correctly; same for disabled/hidden.
        if (!isFragment && key in el) {
          el[key] = value;
        } else if (value) {
          el.setAttribute(key, '');
        } else {
          el.removeAttribute(key);
        }

      } else if (!isFragment && key in el) {
        // Assign DOM properties when possible
        el[key] = value;
  
      } else if (!isFragment) {
        el.setAttribute(key, value);
      }
    }
  
    // ----- Children -----
    const append = (child) => {
      if (child == null) return;
  
      if (Array.isArray(child)) {
        child.forEach(append);
      } else {
        el.appendChild(
          typeof child === 'string'
            ? document.createTextNode(child)
            : child
        );
      }
    };
  
    append(children);
  
    return el;
}