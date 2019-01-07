function ThreadForm(context) {
    this.context = context;
    this.usernameInput = null;
    this.commentInput = null;
    this.submitButton = null;
}

ThreadForm.prototype = {
    submit: function(self) {
        return function(evt) {
            evt.preventDefault();

            var loadingIcon = ui('div', { class: 'loader loader-right' });

            // Explicitly set height so the loading icon will not move the
            // elements.
            var container = self.submitButton.parent();
            container.height(container.height());

            // Replace submit button with loading icon.
            self.submitButton.before(loadingIcon).detach();

            $.ajax({
                method: 'POST',
                url: baseUrl + '/api/thread',
                data: {
                    username: self.usernameInput.val(),
                    text: self.commentInput.val()
                },
                success: function(data) {
                    data['isRecent'] = true;
                    self.context.threadList.prepend(data);
                    self.commentInput.val('');

                    // Replace back loading icon with submit button.
                    loadingIcon.before(self.submitButton).remove();
                }
            });
        };
    },

    render: function() {
        this.usernameInput = ui('input', {
            type: 'text',
            placeholder: 'Name'
        });

        this.commentInput = ui('textarea', {
            rows: 6,
            placeholder: 'Write comment'
        });

        this.submitButton = ui('a', {
            href: '#',
            onclick: this.submit(this),
            text: 'Post comment'
        });

        setView(
            this,
            ui('div', null, [
                ui('p', null, this.usernameInput),
                ui('p', null, this.commentInput),
                ui('p', { class: 'form-buttons-container' }, this.submitButton)
            ])
        );
    },

    mount: function() {
        getView(this.context).append(getView(this));
    }
};
