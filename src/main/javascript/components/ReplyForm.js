function ReplyForm(context) {
    this.context = context;  // Thread

    this.nameInput = null;
    this.replyInput = null;
    this.view = null;
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

            ajax({
                method: 'POST',
                url: baseUrl + '/api/thread/' +
                    self.context.thread.id + '/comment',
                success: function(data) {
                    self.context.addReply({
                        username: self.nameInput.value,
                        text: self.replyInput.value,
                        isRecent: true
                    });
                    self.unmount();
                },
                data: {
                    username: self.nameInput.value,
                    text: self.replyInput.value
                }
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
        getView(this.context).replaceChild(
            getView(this),
            this.context.replyLink
        );
    },

    unmount: function() {
        // replace this form with reply link
        getView(this.context).replaceChild(
            this.context.replyLink,
            getView(this)
        );

        context.replyForm = null;
    },
};
