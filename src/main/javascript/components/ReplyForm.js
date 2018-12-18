function ReplyForm(thread) {
    this.thread = thread;  // context
    this.view = null;
    this.nameInput = null;
    this.replyInput = null;
}

ReplyForm.prototype = {
    cancelListener: function(self) {
        return function(evt) {
            evt.preventDefault();
            self.unmount();
        };
    },

    submitListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var data = {
                username: self.nameInput.val(),
                text: self.replyInput.val()
            };

            var showSubmittedReply = function() {
                self.thread.addReply({
                    username: self.nameInput.val(),
                    text: self.replyInput.val(),
                    isRecent: true
                });
                self.unmount();
            };

            $.ajax({
                method: 'POST',
                url: baseUrl + '/api/thread/' + self.thread.props.id + '/comment',
                data: data,
                dataType: 'jsonp',
                success: showSubmittedReply
            });
        };
    },

    render: function() {
        this.nameInput = $('<input>')
            .attr('type', 'text')
            .attr('placeholder', 'Name');

        this.replyInput = $('<textarea/>')
            .attr('rows', 6)
            .attr('placeholder', 'Write reply');

        var name = $('<p/>').append(this.nameInput);
        var reply = $('<p/>').append(this.replyInput);

        var cancel = $('<a/>')
            .attr('href', '#')
            .click(this.cancelListener(this))
            .text('Cancel');
        var submit = $('<a/>')
            .attr('href', '#')
            .click(this.submitListener(this))
            .text('Post reply');

        var buttons = $('<p/>')
            .addClass('form-buttons-container')
            .append(cancel, submit);

        this.view = $('<div/>').append(name, reply, buttons);
    },

    mount: function() {
        // replace reply link with this form, while keeping events
        this.thread.replyLink.before(getView(this)).detach();
    },

    unmount: function() {
        // replace this form with reply link, while keeping events
        getView(this).before(this.thread.replyLink).detach();
        context.replyForm = null;
    },
};
