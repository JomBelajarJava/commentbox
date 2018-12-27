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
                $.ajax({
                    url: baseUrl + '/api/thread/'
                        + self.props.id + '/comments/earliest',
                    success: function(replies) {
                        self.replyList = new ReplyList(self, replies);
                        self.replyList.mount();
                        self.viewReplyLink.text('Hide replies');
                        self.repliesLoaded = true;
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
