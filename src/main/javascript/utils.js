/*
 * Get view rendered by the component.
 */
var getView = function(component) {
    if (!component._view) {
        component.render();
    }
    return component._view;
};

/*
 * Set the component view.
 */
var setView = function(component, element) {
    component['_view'] = element;
};

/*
 * Attach component view to another component view (appendChild).
 */
var attach = function(component, to) {
    getView(to).appendChild(getView(component));
};

/*
 * Detach component view from another component view (removeChild).
 */
var detach = function(component, from) {
    getView(from).removeChild(getView(component));
};

/*
 * Replace element with another element.
 */
var replace = function(element, withElement) {
    element.parentElement.replaceChild(withElement, element);
};

/*
 * Put at the beginning of the list, a new component.
 */
var begin = function(listComponent, component) {
    getView(listComponent).insertBefore(
        getView(component),
        getView(listComponent).firstChild
    );
};

/*
 * Create HTML element from tagName and attributes. 'onclick' attribute will
 * add as event listener. 'text' attribute will be the text node. Other
 * attributes will set as normal attributes.
 */
var _make = function(tagName, attributes) {
    var element = document.createElement(tagName);
    for (var prop in attributes) {
        if (prop === 'onclick') {
            element.addEventListener('click', attributes[prop]);
        } else if (prop === 'text') {
            var text = document.createTextNode(attributes[prop]);
            element.appendChild(text);
        } else {
            element.setAttribute(prop, attributes[prop]);
        }
    }

    return element;
};

/*
 * Wrap node inside a new element with given tagName and attributes.
 */
var _wrap = function(node, tagName, attributes) {
    var wrapper = _make(tagName, attributes);
    wrapper.appendChild(node);

    return wrapper;
};

/*
 * Group several nodes inside a new element with given tagName and
 * attributes.
 */
var _group = function(nodes, tagName, attributes) {
    var group = _make(tagName, attributes);
    for (var i = 0; i < nodes.length; i++) {
        group.appendChild(nodes[i]);
    }

    return group;
};

/*
 * Helper function to create HTML elements.
 */
var ui = function(tagName, attributes, nodes) {
    if (!nodes) {
        return _make(tagName, attributes);
    } else if (Array.isArray(nodes)) {
        return _group(nodes, tagName, attributes);
    } else {
        return _wrap(nodes, tagName, attributes);
    }
};
