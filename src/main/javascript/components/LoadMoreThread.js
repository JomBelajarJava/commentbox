function LoadMoreThread(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
    this.view = null;
}

LoadMoreThread.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            ajax({
                method: 'GET',
                url: baseUrl + '/api/threads?cursorAfter=' + self.cursorAfter,
                parse: true,
                success: function(threads) {
                    self.threadList.loadMoreThreads(threads);
                }
            });
        };
    },

    render: function() {
        this.view = wrap(
            make('a', {
                href: '#',
                onclick: this.loadMoreListener(this),
                text: 'Load more comments'
            }),
            'li', { class: 'load-more' }
        );
    },

    mount: function() {
        getView(this.threadList).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.threadList).removeChild(getView(this));
        this.threadList.loadMore = null;
    }
};
