function ThreadList(context, threads) {
    context.threadList = this;

    this.context = context;
    this.props = threads;
    this.loadMore = null;
    this.threads = [];
}

ThreadList.prototype = {
    prepend: function(data) {
        this.props.unshift(data);

        var newThread = new Thread(this, data);
        begin(this, newThread);
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

        updateHeight(this);
    },

    renderThreads: function(threads) {
        for (var i = 0; i < threads.length; i++) {
            var thread = new Thread(this, threads[i]);
            thread.mount();
            this.threads.push(thread);
        }
    },

    render: function() {
        setView(this, ui('ul', { class: 'thread-list' }));
        this.renderThreads(this.props);
        this.renderLoadMore();
    },

    mount: function() {
        var computedHeight = computeHeight(this);

        getView(this).style.height = 0;
        attach(this, this.context);
        expand(this, computedHeight);
    }
};
