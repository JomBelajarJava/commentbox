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
                username: self.usernameInput.value,
                text: self.commentInput.value
            };

            var showNewThread = function(thread) {
                self.context.threadList.prepend(thread);
                self.commentInput.value = '';
            };

            ajax({
                method: 'POST',
                url: baseUrl + '/api/thread',
                parse: true,
                data: data,
                success: showNewThread
            });
        };
    },

    render: function() {
        this.usernameInput = make( 'input', {
            type: 'text',
            placeholder: 'Name'
        });

        this.commentInput = make('textarea', {
            rows: 6,
            placeholder: 'Write comment'
        });

        this.submitButton = make('a', {
            href: '#',
            onclick: this.submit(this),
            text: 'Post comment'
        });

        var username = wrap(this.usernameInput, 'p');
        var comment = wrap(this.commentInput, 'p');
        var submit = wrap(
            this.submitButton,
            'p', { class: 'form-buttons-container' }
        );

        this.view = group([username, comment, submit], 'div');
    },

    mount: function () {
        getView(this.context).appendChild(getView(this));
    }
};
