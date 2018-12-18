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
                username: self.nameInput.value,
                text: self.replyInput.value
            };

            var showSubmittedReply = function(data) {
                self.context.addReply({
                    username: self.nameInput.value,
                    text: self.replyInput.value,
                    isRecent: true
                });
                self.unmount();
            };

            ajax({
                method: 'POST',
                url: baseUrl + '/api/thread/' + self.thread.props.id + '/comment',
                data: data,
                success: showSubmittedReply
            });
        };
    },

    render: function() {
        this.nameInput = make('input', {
            type: 'text',
            placeholder: 'Name'
        });
        this.replyInput = make('textarea', {
            rows: 6,
            placeholder: 'Write reply'
        });

        var name = wrap(this.nameInput, 'p');
        var reply = wrap(this.replyInput, 'p');

        var cancel = make('a', {
            href: '#',
            onclick: this.cancelListener(this),
            text: 'Cancel'
        });
        var submit = make('a', {
            href: '#',
            onclick: this.submitListener(this),
            text: 'Post reply'
        });
        var buttons = group(
            [cancel, submit],
            'p', { class: 'form-buttons-container' }
        );

        this.view = group([name, reply, buttons], 'div');
    },

    mount: function() {
        // replace reply link with this form
        getView(this.thread).replaceChild(
            getView(this),
            this.thread.replyLink
        );
    },

    unmount: function() {
        // replace this form with reply link
        getView(this.thread).replaceChild(
            this.thread.replyLink,
            getView(this)
        );

        context.replyForm = null;
    },
};
