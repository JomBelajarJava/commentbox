function ReplyList(thread, replies) {
    this.thread = thread;  // context
    this.props = replies;
    this.loadMore = null;
    this.replies = [];
}

ReplyList.prototype = {
    prepend: function(data) {
        this.props.unshift(data);

        var newReply = new Reply(this, data);
        begin(this, newReply);
        updateHeight(this);
    },

    renderLoadMore: function() {
        if (this.replies.length > 0) {
            var lastReply = this.replies[this.replies.length - 1];
            var cursorAfter = lastReply.props.cursorAfter;
            if (cursorAfter) {
                this.loadMore = new LoadMoreReplies(this, cursorAfter);
                this.loadMore.mount();
            }
        }
    },

    loadMoreReplies: function(replies) {
        this.loadMore.unmount();
        this.renderReplies(replies);
        this.renderLoadMore();
        updateHeight(this);
    },

    renderReplies: function(replies) {
        for (var i = 0; i < replies.length; i++) {
            var reply = new Reply(this, replies[i]);
            reply.mount();
            this.replies.push(reply);
        }
    },

    render: function() {
        setView(this, ui('ul', { class: 'reply-list' }));
        this.renderReplies(this.props);
        this.renderLoadMore();
    },

    mount: function() {
        var element = getView(this);
        var computedHeight = computeHeight(element);

        element.style.height = 0;
        attach(this, this.thread);
        expand(this, computedHeight);
    },

    unmount: function() {
        var self = this;
        var callback = function() {
            detach(self, self.thread);
        };

        collapse(this, callback);
    }
};
