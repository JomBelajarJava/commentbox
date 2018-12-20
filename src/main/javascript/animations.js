/*
 * Compute rendered height of a component. Using a trick by attaching the HTML
 * element sneakily, then get the height, and detach back.
 */
var computeHeight = function(component) {
    var element = getView(component);

    var initialPosition = element.style.position;
    var initialVisibility = element.style.visibility;

    element.style.position = 'absolute';
    element.style.visibility = 'hidden';

    attach(component, context);

    var computedHeight = element.offsetHeight;

    detach(component, context);

    element.style.position = initialPosition;
    element.style.visibility = initialVisibility;

    return computedHeight;
};

/*
 * Expand animation.
 */
var expand = function(component, computedHeight) {
    var element = getView(component);

    function initiate(timestamp) {
        if (element.offsetHeight === 0) {
            element.style.height = computedHeight + 'px';
            requestAnimationFrame(initiate);
        }
    }
    requestAnimationFrame(initiate);
};

/*
 * Collapse animation.
 */
var collapse = function(component, callback) {
    var element = getView(component);
    element.style.height = 0;
    element.style.opacity = 0;

    function finishingAnimation(timestamp) {
        if (element.offsetHeight === 0) {
            callback();
        } else {
            requestAnimationFrame(finishingAnimation);
        }
    }
    requestAnimationFrame(finishingAnimation);
};

/*
 * Update height to trigger height animation.
 */
var updateHeight = function(component) {
    var element = getView(component);
    var newHeight = element.scrollHeight;
    element.style.height = newHeight + 'px';
};
