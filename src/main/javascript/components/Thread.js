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
        if (this.props.repliesCount === 0) {
            this.viewReplyLink.text('');
        } else if (this.props.repliesCount === 1) {
            this.viewReplyLink.text('View reply');
        } else {
            this.viewReplyLink
                .text('View ' + this.props.repliesCount + ' replies');
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
                var showReplies = function(response) {
                    var replies = response.data;

                    self.replyList = new ReplyList(self, replies);
                    self.replyList.mount();
                    self.viewReplyLink.text('Hide replies');
                    self.repliesLoaded = true;
                };

                $.ajax({
                    url: baseUrl + '/api/thread/' + self.props.id +
                        '/comments/earliest',
                    crossDomain: true,
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
        this.viewReplyLink = $('<a/>')
            .attr('href', '#')
            .click(this.viewReplyListener(this));
        this.renderRepliesCount();

        var replyAnchor = $('<a/>')
            .attr('href', '#')
            .click(this.replyListener(this))
            .text('Reply');
        this.replyLink = $('<p/>')
            .addClass('reply-button')
            .append(replyAnchor);

        var name = $('<p/>')
            .append(
                $('<b/>').text(this.props.username)
            );

        var text = $('<p/>').text(this.props.text);

        var viewReply = $('<p/>')
            .addClass('view-reply-button')
            .append(this.viewReplyLink);

        this.view = $('<li/>').append(name, text, this.replyLink, viewReply);
    },

    mount: function() {
        getView(this.threadList).append(getView(this));
    }
};
