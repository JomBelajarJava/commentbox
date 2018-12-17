function LoadMoreThread(context, cursorAfter) {
    this.context = context;  // ThreadList
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
                success: function(moreThreads) {
                    self.context.loadMoreThreads(moreThreads);
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
        getView(this.context).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.context).removeChild(getView(this));
        this.context.loadMore = null;
    }
};
