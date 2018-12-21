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

        if (this.props.repliesCount === 0) {
            textNode.nodeValue = '';
        } else if (this.props.repliesCount === 1) {
            textNode.nodeValue = 'View reply';
        } else {
            textNode.nodeValue = 'View ' + this.props.repliesCount + ' replies';
        }
    },

    addReply: function(reply) {
        this.props.repliesCount++;
        this.renderRepliesCount();

        if (this.replyList) {
            this.replyList.prepend(reply);
        }
    },

    viewReplyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var hideReplies = function() {
                self.replyList.unmount();
                self.renderRepliesCount();
                self.repliesLoaded = false;
            };

            if (self.repliesLoaded) {
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

        setView(this,
            ui('li', null, [
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
