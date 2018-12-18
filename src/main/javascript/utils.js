/*
 * Get view rendered by the component.
 */
var getView = function(component) {
    if (component.view === null) {
        component.render();
    }
    return component.view;
};
