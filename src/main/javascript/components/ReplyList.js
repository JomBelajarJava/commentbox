function ReplyList(thread, replies) {
    this.thread = thread;  // context
    this.props = replies;
    this.view = null;
    this.loadMore = null;
    this.replies = [];
}

ReplyList.prototype = {
    prepend: function(data) {
        this.props.unshift(data);

        var reply = new Reply(this, data);
        getView(this).insertBefore(getView(reply), getView(this).firstChild);
    },

    renderLoadMore: function() {
        var lastReply = this.replies[this.replies.length - 1];
        var cursorAfter = lastReply.props.cursorAfter;
        if (cursorAfter !== null) {
            this.loadMore = new LoadMoreReplies(this, cursorAfter);
            this.loadMore.mount();
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
        this.view = make('ul');
        this.renderReplies(this.props);
        this.renderLoadMore();
    },

    mount: function() {
        getView(this.thread).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.thread).removeChild(getView(this));
        this.thread.replyList = null;
    }
};
