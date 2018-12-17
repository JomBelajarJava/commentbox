function ReplyList(context, replies) {
    this.context = context;  // Thread
    this.replies = [];
    this.loadMore = null;
    this.view = null;

    for (var i = 0; i < replies.length; i++) {
        var reply = new Reply(this, replies[i]);
        this.replies.push(reply);
    }
}

ReplyList.prototype = {
    prepend: function(data) {
        var reply = new Reply(this, data);
        this.replies.unshift(data);
        getView(this).insertBefore(getView(reply), getView(this).firstChild);
    },

    loadMoreReplies: function(moreReplies) {
        this.loadMore.unmount();

        for (var i = 0; i < moreReplies.length; i++) {
            var reply = new Reply(this, moreReplies[i]);
            this.replies.push(reply);
            reply.mount();
        }

        this.renderLoadMore();
    },

    renderLoadMore: function() {
        var lastReply = this.replies[this.replies.length - 1];
        var cursorAfter = lastReply.reply.cursorAfter;
        if (cursorAfter !== null) {
            this.loadMore = new LoadMoreReplies(this, cursorAfter);
            this.loadMore.mount();
        }
    },

    render: function() {
        this.view = make('ul');
        for (var i = 0; i < this.replies.length; i++) {
            this.replies[i].mount();
        }

        this.renderLoadMore();
    },

    mount: function() {
        getView(this.context).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.context).removeChild(getView(this));
        this.context.replyList = null;
    }
};
