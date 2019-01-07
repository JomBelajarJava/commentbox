function Thread(threadList, thread) {
    this.threadList = threadList;  // context
    this.props = thread;
    this.viewReplyLink = null;
    this.replyLink = null;
    this.replyList = null;

    this.repliesLoaded = false;
}

Thread.prototype = {
    renderRepliesCount: function() {
        var selectWords = function(count) {
            switch (count) {
            case 0: return '';
            case 1: return 'View reply';
            default: return 'View ' + count + ' replies';
            }
        };

        this.viewReplyLink.text(selectWords(this.props.repliesCount));
    },

    addReply: function(reply) {
        this.props.repliesCount++;

        if (this.repliesLoaded) {
            this.replyList.prepend(reply);
        } else {
            this.renderRepliesCount();
        }
    },

    viewReplyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            if (self.repliesLoaded) {
                // Hide replies
                self.replyList.unmount();
                self.renderRepliesCount();
                self.repliesLoaded = false;
            } else {
                // Show replies

                var loadingIcon = ui('div', { class: 'loader' });

                // Explicitly set height so the loading icon will not push other
                // elements.
                var container = self.viewReplyLink.parent();
                container.height(container.height());

                // Replace view reply link with loading icon.
                self.viewReplyLink.before(loadingIcon).detach();

                $.ajax({
                    url: baseUrl + '/api/thread/'
                        + self.props.id + '/comments/earliest',
                    success: function(replies) {
                        self.replyList = new ReplyList(self, replies);
                        self.replyList.mount();
                        self.viewReplyLink.text('Hide replies');
                        self.repliesLoaded = true;

                        // Replace loading icon back to view reply link.
                        loadingIcon.before(self.viewReplyLink).remove();
                    }
                });
            }
        };
    },

    replyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var replyForm = new ReplyForm(self);
            replyForm.mount();
        };
    },

    render: function() {
        this.viewReplyLink = ui('a', {
            href: '#',
            onclick: this.viewReplyListener(this)
        });
        this.renderRepliesCount();

        this.replyLink = ui('p', { class: 'reply-button' },
                            ui('a', {
                                href: '#',
                                onclick: this.replyListener(this),
                                text: 'Reply'
                            }));

        var attr = this.props.isRecent ? { class: 'recent' } : null;

        setView(
            this,
            ui('li', attr, [
                ui('p', null, ui('b', { text: this.props.username })),
                ui('p', { text: this.props.text }),
                this.replyLink,
                ui('p', { class: 'view-reply-button' }, this.viewReplyLink)
            ])
        );
    },

    mount: function() {
        getView(this.threadList).append(getView(this));
    }
};
