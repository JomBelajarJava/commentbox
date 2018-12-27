var baseUrl = '{{baseUrl}}';
var context = {
    threadForm: null,
    threadList: null
};
setView(context, $('div#jombelajarjava-commentbox'));

/*
 * Initialize comment box.
 */
var init = function() {
    context.threadForm = new ThreadForm(context);
    context.threadForm.mount();

    $.ajax({
        url: baseUrl + '/api/threads/latest',
        success: function(data) {
            context.threadList = new ThreadList(context, data);
            context.threadList.mount();
        }
    });
};

init();
