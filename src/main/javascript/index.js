var baseUrl = 'http://localhost:8080';
var context = {
    threadForm: null,
    threadList: null,
    replyForm: null,
    view: document.getElementById('jombelajarjava-commentbox')
};

/*
 * Initialize comment box.
 */
var init = function() {
    var threadForm = new ThreadForm(context);
    threadForm.mount();

    ajax({
        method: 'GET',
        url: baseUrl + '/api/threads/latest',
        parse: true,
        success: function(threads) {
            var threadList = new ThreadList(context, threads);
            threadList.mount();
        }
    });
};

init();
