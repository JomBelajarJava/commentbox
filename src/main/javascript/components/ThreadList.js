function ThreadList(context, threads) {
    context.threadList = this;

    this.context = context;
    this.props = threads;
    this.view = null;
    this.loadMore = null;
    this.threads = [];
}

ThreadList.prototype = {
    prepend: function(data) {
        this.props.unshift(data);

        var thread = new Thread(this, data);
        getView(this).prepend(getView(thread));
    },

    renderLoadMore: function() {
        if (this.threads.length > 0) {
            var lastThread = this.threads[this.threads.length - 1];
            var cursorAfter = lastThread.props.cursorAfter;
            if (cursorAfter !== null) {
                this.loadMore = new LoadMoreThreads(this, cursorAfter);
                this.loadMore.mount();
            }
        }
    },

    loadMoreThreads: function(threads) {
        this.props.concat(threads);

        this.loadMore.unmount();
        this.renderThreads(threads);
        this.renderLoadMore();
    },

    renderThreads: function(threads) {
        for (var i = 0; i < threads.length; i++) {
            var thread = new Thread(this, threads[i]);
            thread.mount();
            this.threads.push(thread);
        }
    },

    render: function() {
        this.view = $('<ul/>').addClass('thread-list');
        this.renderThreads(this.props);
        this.renderLoadMore();
    },

    mount: function() {
        getView(this.context).append(getView(this));
    }
};
