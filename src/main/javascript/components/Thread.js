function Thread(threadList, thread) {
    this.threadList = threadList;  // context
    this.props = thread;
    this.viewReply = null;
    this.viewReplyLink = null;
    this.replyLink = null;
    this.replyList = null;
    this.replyForm = null;

    this.repliesLoaded = false;
}

Thread.prototype = {
    renderRepliesCount: function() {
        var selectText = function(count) {
            if (count === 0) {
                return '';
            } else if (count === 1) {
                return 'View reply';
            } else {
                return 'View ' + count + ' replies';
            }
        };

        // firstChild is the TextNode.
        this.viewReplyLink.firstChild.nodeValue =
            selectText(this.props.repliesCount);
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
                // Hide replies.
                self.replyList.unmount();
                self.renderRepliesCount();
                self.repliesLoaded = false;
            } else {
                // Show replies from ajax request.
                var url = baseUrl + '/api/thread/' +
                    self.props.id + '/comments/earliest';

                ajax({
                    loadingIconContainer: self.viewReply,
                    request: axios.get(url),
                    before: function(loadingIconContainer) {
                        // Set height so it will have fixed height, therefore
                        // the loader will not push the other element.
                        loadingIconContainer.style.height =
                            self.viewReply.offsetHeight + 'px';
                        loadingIconContainer.removeChild(self.viewReplyLink);
                    },
                    success: function(response) {
                        self.replyList = new ReplyList(self, response.data);
                        self.replyList.mount();
                    },
                    after: function(loadingIconContainer) {
                        loadingIconContainer.appendChild(self.viewReplyLink);
                        self.viewReplyLink.firstChild.nodeValue = 'Hide replies';
                        updateHeight(self.threadList);
                        self.repliesLoaded = true;
                    }
                });
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

        this.viewReply = ui('p', { class: 'view-reply-button' },
                            this.viewReplyLink);

        this.replyLink = ui('p', { class: 'reply-button' },
                            ui('a', {
                                href: '#',
                                onclick: this.replyListener(this),
                                text: 'Reply'
                            }));

        var attr = this.props.isRecent ? { class: 'recent' } : null;

        setView(this,
                ui('li', attr, [
                    ui('p', null, ui('b', { text: this.props.username })),
                    ui('p', { text: this.props.text }),
                    this.replyLink,
                    this.viewReply
                ])
               );
    },

    mount: function() {
        getView(this.threadList).appendChild(getView(this));
    }
};
