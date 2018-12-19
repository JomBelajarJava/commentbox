var baseUrl = 'https://vivid-reality-225905.appspot.com';
var context = {
    threadForm: null,
    threadList: null,
    replyForm: null,
    view: $('div#jombelajarjava-commentbox')
};

/*
 * Initialize comment box.
 */
var init = function() {
    var threadForm = new ThreadForm(context);
    threadForm.mount();

    $.ajax({
        url: baseUrl + '/api/threads/latest',
        dataType: 'jsonp',
        success: function(response) {
            var threadList = new ThreadList(context, response.data);
            threadList.mount();
        }
    });
};

init();
