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

            var buttonsContainer = $(evt.target).parent();
            var buttons = buttonsContainer.children();
            var loadingIcon = ui('div', { class: 'loader loader-right' });

            // Explicitly set height so the loading icon will not move the
            // elements.
            buttonsContainer.height(buttonsContainer.height());

            // Replace buttons with loading icon.
            buttons.detach();
            buttonsContainer.append(loadingIcon);

            $.ajax({
                method: 'POST',
                url: baseUrl + '/api/thread/' + self.thread.props.id + '/comment',
                data: {
                    username: self.nameInput.val(),
                    text: self.replyInput.val()
                },
                success: function() {
                    self.thread.addReply({
                        username: self.nameInput.val(),
                        text: self.replyInput.val(),
                        isRecent: true
                    });
                    self.replyInput.val('');

                    // Replace back loading icon with submit button.
                    loadingIcon.remove();
                    buttonsContainer.append(buttons);
                }
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
            ui('div', { class: 'reply-form' }, [
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
        // Replace reply link with this form, while keeping events;
        this.thread.replyLink.before(getView(this)).detach();
        getView(this).fadeIn(300);
    },

    unmount: function() {
        var element = getView(this);
        var replyLink = this.thread.replyLink;

        element.fadeOut(300, function() {
            // Replace this form with reply link.
            element.before(replyLink).remove();
        });
    },
};
