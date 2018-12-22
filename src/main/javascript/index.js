var baseUrl = '{{baseUrl}}';
var context = {
    threadForm: null,
    threadList: null
};
setView(context, document.querySelector('div#jombelajarjava-commentbox'));

/*
 * Initialize comment box.
 */
var init = function() {
    var threadForm = new ThreadForm(context);
    threadForm.mount();

    ajax({
        loadingIconContainer: getView(context),
        request: axios.get(baseUrl + '/api/threads/latest'),
        success: function(response) {
            var threadList = new ThreadList(context, response.data);
            threadList.mount();
        }
    });
};

init();
