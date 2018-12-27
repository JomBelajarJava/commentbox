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
        getView(newReply).fadeIn(300);
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
        var element = getView(this);
        element.height(element.height());

        this.loadMore.unmount();
        this.renderReplies(replies);
        this.renderLoadMore();

        element.animate({ height: element.get(0).scrollHeight }, 300);
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
        getView(this.thread).append(getView(this));
        getView(this).slideDown(300);
    },

    unmount: function() {
        var element = getView(this);

        element.slideUp(300, function() {
            element.remove();
        });
    }
};
