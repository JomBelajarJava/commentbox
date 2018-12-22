/*
 * Compute rendered height of an element. Using a trick by attaching the HTML
 * element sneakily, then get the height, and detach back.
 */
var computeHeight = function(element, container) {
    var parentElement = container || getView(context);
    var initialPosition = element.style.position;
    var initialVisibility = element.style.visibility;

    // Position 'absolute' combined with visiblity 'hidden' will not be seen by
    // users, but will allow its rendered height(clientHeight, offsetHeight,
    // scrollHeight) be read by javascript after appending.
    element.style.position = 'absolute';
    element.style.visibility = 'hidden';

    parentElement.appendChild(element);

    var computedHeight = element.offsetHeight;

    parentElement.removeChild(element);

    // Reset style.
    element.style.position = initialPosition;
    element.style.visibility = initialVisibility;

    return computedHeight;
};

/*
 * Expand animation.
 */
var expand = function(args) {
    // Destructuring args.
    var element = args.element;  // required
    var container = args.container || getView(context);
    var initialHeight = args.initialHeight || 0;
    var before = args.before || function(){};
    var after = args.after || function(){};

    var computedHeight = computeHeight(element, container);

    element.style.height = initialHeight + 'px';

    container.appendChild(element);

    // Call 'before' callback before starting animation.
    before(element, container, initialHeight);

    function animationListener(timestamp) {
        if (element.offsetHeight === initialHeight) {
            // Sometimes browser takes some milliseconds after appendChild to
            // render. When we change style right away, it may not do the
            // transition. So, we have to repeatedly check using
            // requestAnimationFrame.
            element.style.height = computedHeight + 'px';
            requestAnimationFrame(animationListener);
        } else if (element.offsetHeight === computedHeight) {
            // Call 'after' callback when done.
            after(element, container, initialHeight);
        } else {
            requestAnimationFrame(animationListener);
        }
    }
    requestAnimationFrame(animationListener);
};

/*
 * Collapse animation. finalHeight is optional.
 */
var collapse = function(args) {
    // Destructuring args.
    var element = args.element;
    var finalHeight = args.finalHeight || 0;
    var before = args.before || function(){};
    var after = args.after || function(){};

    // Call 'before' callback before starting animation.
    before(element, finalHeight);

    element.style.height = finalHeight + 'px';
    element.style.opacity = 0;

    function animationListener(timestamp) {
        if (element.offsetHeight === finalHeight) {
            // Call 'after' callback when done.
            after(element, finalHeight);
        } else {
            requestAnimationFrame(animationListener);
        }
    }
    requestAnimationFrame(animationListener);
};

/*
 * Update height to trigger height animation.
 */
var updateHeight = function(component) {
    var element = getView(component);
    var newHeight = element.scrollHeight;
    element.style.height = newHeight + 'px';
};
