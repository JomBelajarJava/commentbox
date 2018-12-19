function LoadMoreThreads(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreThreads.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            axios
                .get(baseUrl + '/api/threads', {
                    params: { cursorAfter: self.cursorAfter }
                })
                .then(function(response) {
                    self.threadList.loadMoreThreads(response.data);
                });
        };
    },

    render: function() {
        setView(this,
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
        getView(this.threadList).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.threadList).removeChild(getView(this));
        this.threadList.loadMore = null;
    }
};
