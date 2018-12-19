var baseUrl = '{{baseUrl}}';
var context = {
    threadForm: null,
    threadList: null,
    replyForm: null
};
setView(context, document.querySelector('div#jombelajarjava-commentbox'));

/*
 * Initialize comment box.
 */
var init = function() {
    var threadForm = new ThreadForm(context);
    threadForm.mount();

    axios
        .get(baseUrl + '/api/threads/latest')
        .then(function(response) {
            var threadList = new ThreadList(context, response.data);
            threadList.mount();
        });
};

init();
