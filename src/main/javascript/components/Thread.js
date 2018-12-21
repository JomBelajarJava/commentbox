function Thread(threadList, thread) {
    this.threadList = threadList;  // context
    this.props = thread;
    this.viewReplyLink = null;
    this.replyLink = null;
    this.replyList = null;
    this.replyForm = null;

    this.repliesLoaded = false;
}

Thread.prototype = {
    renderRepliesCount: function() {
        var textNode = this.viewReplyLink.firstChild;

        var selectText = function(count) {
            if (count === 0) {
                return '';
            } else if (count === 1) {
                return 'View reply';
            } else {
                return 'View ' + count + ' replies';
            }
        };

        textNode.nodeValue = selectText(this.props.repliesCount);
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
                var hideReplies = function() {
                    self.replyList.unmount();
                    self.renderRepliesCount();
                    self.repliesLoaded = false;
                };

                hideReplies();
            } else {
                var showReplies = function(response) {
                    var replies = response.data;

                    self.replyList = new ReplyList(self, replies);
                    self.replyList.mount();
                    self.viewReplyLink.firstChild.nodeValue = 'Hide replies';
                    self.repliesLoaded = true;
                };

                var url = baseUrl + '/api/thread/' + self.props.id +
                    '/comments/earliest';

                axios
                    .get(url)
                    .then(showReplies);
            }
        };
    },

    replyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            self.replyForm = new ReplyForm(self);
            self.replyForm.mount();
        };
    },

    render: function() {
        this.viewReplyLink = ui('a', {
            href: '#',
            onclick: this.viewReplyListener(this),
            text: ''  // append textnode, required for renderRepliesCount()
        });
        this.renderRepliesCount();

        this.replyLink = ui('p', { class: 'reply-button' },
                            ui('a', {
                                href: '#',
                                onclick: this.replyListener(this),
                                text: 'Reply'
                            }));

        var attr = null;
        if (this.props.isRecent) {
            attr = { class: 'recent' };
        }

        setView(this,
            ui('li', attr, [
                ui('p', null, ui('b', { text: this.props.username })),
                ui('p', { text: this.props.text }),
                this.replyLink,
                ui('p', { class: 'view-reply-button' }, this.viewReplyLink)
            ])
        );
    },

    mount: function() {
        attach(this, this.threadList);
    }
};
