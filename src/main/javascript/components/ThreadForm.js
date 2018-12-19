function ThreadForm(context) {
    context.threadForm = this;

    this.context = context;
    this.usernameInput = null;
    this.commentInput = null;
    this.submitButton = null;
}

ThreadForm.prototype = {
    submit: function(self) {
        return function(evt) {
            evt.preventDefault();

            var data = {
                username: self.usernameInput.value,
                text: self.commentInput.value
            };

            var showNewThread = function(response) {
                self.context.threadList.prepend(response.data);
                self.commentInput.value = '';
            };

            axios
                .post(baseUrl + '/api/thread', data)
                .then(showNewThread);
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

        setView(this,
            ui('div', null, [
                ui('p', null, this.usernameInput),
                ui('p', null, this.commentInput),
                ui('p', { class: 'form-buttons-container' }, this.submitButton)
            ])
        );
    },

    mount: function () {
        getView(this.context).appendChild(getView(this));
    }
};
