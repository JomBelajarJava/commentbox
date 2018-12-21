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

    var loader = ui('div', { class: 'loader' });
    getView(context).appendChild(loader);

    axios
        .get(baseUrl + '/api/threads/latest')
        .then(function(response) {
            getView(context).removeChild(loader);
            var threadList = new ThreadList(context, response.data);
            threadList.mount();
        });
};

init();
