function ThreadForm(context) {
    context.threadForm = this;

    this.context = context;
    this.usernameInput = null;
    this.commentInput = null;
    this.submitButton = null;
    this.submitContainer = null;
}

ThreadForm.prototype = {
    submit: function(self) {
        return function(evt) {
            evt.preventDefault();

            var data = {
                username: self.usernameInput.value,
                text: self.commentInput.value
            };

            ajax({
                loadingIconContainer: self.submitContainer,
                loaderClass: 'loader-right',
                request: axios.post(baseUrl + '/api/thread', data),
                before: function(container) {
                    // Set height so it will have fixed height, therefore
                    // the loader will not push the other element.
                    container.style.height = container.offsetHeight + 'px';
                    container.removeChild(self.submitButton);
                },
                success: function(response) {
                    response.data['isRecent'] = true;
                    self.context.threadList.prepend(response.data);
                },
                after: function(container) {
                    container.appendChild(self.submitButton);
                    self.commentInput.value = '';
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

        this.submitContainer = ui('p', {
            class: 'form-buttons-container'
        }, this.submitButton);

        setView(this,
                ui('div', null, [
                    ui('p', null, this.usernameInput),
                    ui('p', null, this.commentInput),
                    this.submitContainer
                ])
               );
    },

    mount: function () {
        getView(this.context).appendChild(getView(this));
    }
};
