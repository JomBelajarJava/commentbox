/*
 * Compute rendered height of an element. Using a trick by attaching the HTML
 * element sneakily, then get the height, and detach back.
 */
var computeHeight = function(element) {
    var initialPosition = element.style.position;
    var initialVisibility = element.style.visibility;

    element.style.position = 'absolute';
    element.style.visibility = 'hidden';

    getView(context).appendChild(element);

    var computedHeight = element.offsetHeight;

    getView(context).removeChild(element);

    element.style.position = initialPosition;
    element.style.visibility = initialVisibility;

    return computedHeight;
};

/*
 * Expand animation. initialHeight is optional.
 */
var expand = function(component, computedHeight, initialHeight) {
    var element = getView(component);

    function initiate(timestamp) {
        if (element.offsetHeight === initialHeight || element.offsetHeight === 0) {
            element.style.height = computedHeight + 'px';
            requestAnimationFrame(initiate);
        }
    }
    requestAnimationFrame(initiate);
};

/*
 * Collapse animation. finalHeight is optional.
 */
var collapse = function(component, callback, finalHeight) {
    var element = getView(component);
    element.style.height = (finalHeight || 0) + 'px';
    element.style.opacity = 0;

    function finishingAnimation(timestamp) {
        var condition = finalHeight ?
            (element.offsetHeight === finalHeight) :
            (element.offsetHeight === 0);

        if (condition) {
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
