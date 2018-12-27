function LoadMoreThreads(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreThreads.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            $.ajax({
                url: baseUrl + '/api/threads?cursorAfter=' + self.cursorAfter,
                success: function(data) {
                    self.threadList.loadMoreThreads(data);
                }
            });
        };
    },

    render: function() {
        setView(
            this,
            ui('li', { class: 'load-more' },
               ui('a', {
                   href: '#',
                   onclick: this.loadMoreListener(this),
                   text: 'Load more comments'
               })
              )
        );
    },

    mount: function() {
        getView(this.threadList).append(getView(this));
    },

    unmount: function() {
        getView(this).remove();
        // this.threadList.loadMore = null;
    }
};
