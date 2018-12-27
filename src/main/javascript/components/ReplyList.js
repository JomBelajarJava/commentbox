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
        getView(this).prepend(getView(newReply));
    },

    renderLoadMore: function() {
        if (this.replies.length > 0) {
            var lastReply = this.replies[this.replies.length - 1];
            var cursorAfter = lastReply.props.cursorAfter;
            if (cursorAfter !== null) {
                this.loadMore = new LoadMoreReplies(this, cursorAfter);
                this.loadMore.mount();
            }
        }
    },

    loadMoreReplies: function(replies) {
        this.loadMore.unmount();
        this.renderReplies(replies);
        this.renderLoadMore();
    },

    renderReplies: function(replies) {
        for (var i = 0; i < replies.length; i++) {
            var reply = new Reply(this, replies[i]);
            reply.mount();
            this.replies.push(reply);
        }
    },

    render: function() {
        setView(this, ui('ul'));
        this.renderReplies(this.props);
        this.renderLoadMore();
    },

    mount: function() {
        getView(this.thread).append(getView(this));
    },

    unmount: function() {
        getView(this).remove();
        // this.thread.replyList = null;
    }
};
