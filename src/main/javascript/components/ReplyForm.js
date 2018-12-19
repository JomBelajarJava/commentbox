function ReplyForm(thread) {
    this.thread = thread;  // context
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

            var url = baseUrl + '/api/thread/' + self.thread.props.id + '/comment';

            var data = {
                username: self.nameInput.value,
                text: self.replyInput.value
            };

            var showSubmittedReply = function() {
                self.thread.addReply({
                    username: self.nameInput.value,
                    text: self.replyInput.value,
                    isRecent: true
                });
                self.unmount();
            };

            axios
                .post(url, data)
                .then(showSubmittedReply);
        };
    },

    render: function() {
        this.nameInput = ui('input', {
            type: 'text',
            placeholder: 'Name'
        });

        this.replyInput = ui('textarea', {
            rows: 6,
            placeholder: 'Write reply'
        });

        var name = ui('p', null, this.nameInput);
        var reply = ui('p', null, this.replyInput);

        setView(this,
            ui('div', null, [
                name,
                reply,
                ui('p', { class: 'form-buttons-container' }, [
                    ui('a', {
                        href: '#',
                        onclick: this.cancelListener(this),
                        text: 'Cancel'
                    }),
                    ui('a', {
                        href: '#',
                        onclick: this.submitListener(this),
                        text: 'Post reply'
                    })
                ])
            ])
        );
    },

    mount: function() {
        replace(this.thread.replyLink, getView(this));
    },

    unmount: function() {
        replace(getView(this), this.thread.replyLink);
        context.replyForm = null;
    },
};
