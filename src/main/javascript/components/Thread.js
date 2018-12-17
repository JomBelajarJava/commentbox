function Thread(context, thread) {
    this.context = context;  // ThreadList
    this.thread = thread;

    this.view = null;
    this.viewReplyLink = null;
    this.replyLink = null;
    this.replyList = null;

    this.repliesLoaded = false;
}

Thread.prototype = {
    chooseWord: function() {
        if (this.thread.repliesCount === 0 ||
            this.thread.repliesCount === null) {
            return '';
        } else if (this.thread.repliesCount === 1) {
            return 'View reply';
        }
        return 'View ' + this.thread.repliesCount + ' replies';
    },

    addReply: function(data) {
        this.thread.repliesCount++;

        if (this.replyList === null) {
            this.viewReplyLink.firstChild.nodeValue = this.chooseWord();
        } else {
            this.replyList.prepend(data);
        }
    },

    hideReplies: function() {
        this.replyList.unmount();
        this.viewReplyLink.firstChild.nodeValue = this.chooseWord();
        this.repliesLoaded = false;
    },

    showReplies: function(self) {
        return function(replies) {
            self.replyList = new ReplyList(self, replies);
            self.replyList.mount();
            self.viewReplyLink.firstChild.nodeValue = 'Hide replies';
            self.repliesLoaded = true;
        };
    },

    viewReplyListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            if (self.repliesLoaded) {
                self.hideReplies();
            } else {
                ajax({
                    method: 'GET',
                    url: baseUrl + '/api/thread/' +
                        self.thread.id + '/comments/earliest',
                    success: self.showReplies(self),
                    parse: true
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
            text: this.chooseWord()
        });

        this.replyLink = wrap(
            make('a', {
                href: '#',
                onclick: this.replyListener(this),
                text: 'Reply'
            }),
            'p', { class: 'reply-button' }
        );

        var name = wrap(make('b', {text: this.thread.username}), 'p');
        var text = make('p' , {text: this.thread.text});
        var viewReply = wrap(
            this.viewReplyLink,
            'p', { class: 'view-reply-button' }
        );

        var elements = [name, text, this.replyLink, viewReply];

        this.view = group(elements, 'li');
    },

    mount: function() {
        getView(this.context).appendChild(getView(this));
    }
};
