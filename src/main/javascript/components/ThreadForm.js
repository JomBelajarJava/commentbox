function ThreadForm(context) {
    context.threadForm = this;

    this.context = context;
    this.usernameInput = null;
    this.commentInput = null;
    this.submitButton = null;
    this.view = null;
}

ThreadForm.prototype = {
    submit: function(self) {
        return function(evt) {
            evt.preventDefault();

            var data = {
                username: self.usernameInput.val(),
                text: self.commentInput.val()
            };

            var showNewThread = function(response) {
                self.context.threadList.prepend(response.data);
                self.commentInput.val('');
            };

            $.ajax({
                method: 'POST',
                url: baseUrl + '/api/thread',
                data: data,
                crossDomain:true,
                success: showNewThread
            });
        };
    },

    render: function() {
        this.usernameInput = $('<input>')
            .attr('type', 'text')
            .attr('placeholder', 'Name');

        this.commentInput = $('<textarea/>')
            .attr('rows', 6)
            .attr('placeholder', 'Write comment');

        this.submitButton = $('<a/>')
            .attr('href', '#')
            .click(this.submit(this))
            .text('Post comment');

        var username = $('<p/>').append(this.usernameInput);
        var comment = $('<p/>').append(this.commentInput);
        var submit = $('<p/>')
            .addClass('form-buttons-container')
            .append(this.submitButton);

        this.view = $('<div/>').append(username, comment, submit);
    },

    mount: function () {
        getView(this.context).append(getView(this));
    }
};
