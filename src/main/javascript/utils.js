/*
 * Get view rendered by the component.
 */
var getView = function(component) {
    if (component.view === null) {
        component.render();
    }
    return component.view;
};

/*
 * Make an AJAX request. Takes argument object with properties:
 * method, url, success, data, parse
 */
var ajax = function(args) {
    var xhr = new XMLHttpRequest();
    xhr.open(args.method, args.url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (args.parse) {
                var response = JSON.parse(xhr.responseText);
                args.success(response.data);
            } else {
                args.success(xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify(args.data));
};

/*
 * Create HTML element from tagName and attributes. 'onclick' attribute will
 * add as event listener. 'text' attribute will be the text node. Other
 * attributes will set as normal attributes.
 */
var make = function(tagName, attributes) {
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
var wrap = function(node, tagName, attributes) {
    var wrapper = make(tagName, attributes);
    wrapper.appendChild(node);

    return wrapper;
};

/*
 * Group several nodes inside a new element with given tagName and
 * attributes.
 */
var group = function(nodes, tagName, attributes) {
    var group = make(tagName, attributes);
    for (var i = 0; i < nodes.length; i++) {
        group.appendChild(nodes[i]);
    }

    return group;
};
