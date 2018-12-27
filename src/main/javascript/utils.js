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
 * Create HTML element from tagName and attributes. 'onclick' attribute will
 * add as event listener. 'text' attribute will be the text node. Other
 * attributes will set as normal attributes.
 */
var _make = function(tagName, attributes) {
    var element = $('<' + tagName + '/>');
    for (var prop in attributes) {
        if (prop === 'class') {
            element.addClass(attributes[prop]);
        } else if (prop === 'onclick') {
            element.click(attributes[prop]);
        } else if (prop === 'text') {
            element.text(attributes[prop]);
        } else {
            element.attr(prop, attributes[prop]);
        }
    }

    return element;
};

/*
 * Wrap node inside a new element with given tagName and attributes.
 */
var _wrap = function(node, tagName, attributes) {
    var wrapper = _make(tagName, attributes);
    wrapper.append(node);

    return wrapper;
};

/*
 * Group several nodes inside a new element with given tagName and
 * attributes.
 */
var _group = function(nodes, tagName, attributes) {
    var group = _make(tagName, attributes);
    for (var i = 0; i < nodes.length; i++) {
        group.append(nodes[i]);
    }

    return group;
};

/*
 * Helper function to create HTML elements.
 */
var ui = function(tagName, attributes, nodes) {
    if (!nodes) {
        return _make(tagName, attributes);
    } else if ($.isArray(nodes)) {
        return _group(nodes, tagName, attributes);
    } else {
        return _wrap(nodes, tagName, attributes);
    }
};
