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
                success: showSubmittedReply
            });
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

        setView(
            this,
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
        // replace reply link with this form, while keeping events
        this.thread.replyLink.before(getView(this)).detach();
    },

    unmount: function() {
        // replace this form with reply link, while keeping events
        getView(this).before(this.thread.replyLink).detach();
        // context.replyForm = null;
    },
};
