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
        prependElement(getView(this), getView(newReply));
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
        expand({
            element: getView(this),
            container: getView(this.thread)
        });
    },

    unmount: function() {
        collapse({
            element: getView(this),
            after: function(element) {
                element.parentElement.removeChild(element);
            }
        });
    }
};
