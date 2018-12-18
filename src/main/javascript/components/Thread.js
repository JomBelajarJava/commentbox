function Thread(threadList, thread) {
    this.threadList = threadList;  // context
    this.props = thread;
    this.view = null;
    this.viewReplyLink = null;
    this.replyLink = null;
    this.replyList = null;

    this.repliesLoaded = false;
}

Thread.prototype = {
    renderRepliesCount: function() {
        var textNode = this.viewReplyLink.firstChild;

        if (this.props.repliesCount === 0) {
            textNode.nodeValue = '';
        } else if (this.props.repliesCount === 1) {
            textNode.nodeValue =  'View reply';
        } else {
            textNode.nodeValue = 'View ' + this.props.repliesCount + ' replies';
        }
    },

    addReply: function(reply) {
        this.props.repliesCount++;

        if (this.replyList === null) {  // if replyList is not shown
            this.renderRepliesCount();
        } else {
            this.replyList.prepend(reply);
        }
    },

    viewReplyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            if (self.repliesLoaded) {
                self.replyList.unmount();
                self.renderRepliesCount();
                self.repliesLoaded = false;
            } else {
                var showReplies = function(replies) {
                    self.replyList = new ReplyList(self, replies);
                    self.replyList.mount();
                    self.viewReplyLink.firstChild.nodeValue = 'Hide replies';
                    self.repliesLoaded = true;
                };

                ajax({
                    method: 'GET',
                    url: baseUrl + '/api/thread/' +
                        self.props.id + '/comments/earliest',
                    parse: true,
                    success: showReplies
                });
            }
        };
    },

    replyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            if (context.replyForm !== null) {
                context.replyForm.unmount();
            }
            context.replyForm = new ReplyForm(self);
            context.replyForm.mount();
        };
    },

    render: function() {
        this.viewReplyLink = make('a', {
            href: '#',
            onclick: this.viewReplyListener(this),
            text: ''  // append textnode, required for renderRepliesCount()
        });
        this.renderRepliesCount();

        this.replyLink = wrap(
            make('a', {
                href: '#',
                onclick: this.replyListener(this),
                text: 'Reply'
            }),
            'p', { class: 'reply-button' }
        );

        var name = wrap(make('b', { text: this.props.username }), 'p');
        var text = make('p' , { text: this.props.text });
        var viewReply = wrap(
            this.viewReplyLink,
            'p', { class: 'view-reply-button' }
        );

        var elements = [name, text, this.replyLink, viewReply];

        this.view = group(elements, 'li');
    },

    mount: function() {
        getView(this.threadList).appendChild(getView(this));
    }
};
