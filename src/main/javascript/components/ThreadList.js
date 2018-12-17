function ThreadList(context, threads) {
    context.threadList = this;

    this.context = context;
    this.threads = [];
    this.loadMore = null;
    this.view = null;

    for (var i = 0; i < threads.length; i++) {
        var thread = new Thread(this, threads[i]);
        this.threads.push(thread);
    }
}

ThreadList.prototype = {
    prepend: function(data) {
        var thread = new Thread(this, data);
        this.threads.unshift(data);
        getView(this).insertBefore(getView(thread), getView(this).firstChild);
    },

    renderLoadMore: function() {
        var lastThread = this.threads[this.threads.length - 1];
        var cursorAfter = lastThread.thread.cursorAfter;
        if (cursorAfter !== null) {
            this.loadMore = new LoadMoreThread(this, cursorAfter);
            this.loadMore.mount();
        }
    },

    loadMoreThreads: function(moreThreads) {
        this.loadMore.unmount();

        for (var i = 0; i < moreThreads.length; i++) {
            var thread = new Thread(this, moreThreads[i]);
            this.threads.push(thread);
            thread.mount();
        }

        this.renderLoadMore();
    },

    render: function() {
        this.view = make('ul', { class: 'thread-list' });
        for (var i = 0; i < this.threads.length; i++) {
            this.threads[i].mount();
        }

        this.renderLoadMore();
    },

    mount: function() {
        getView(this.context).appendChild(getView(this));
    }
};
