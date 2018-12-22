function LoadMoreThreads(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreThreads.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var url = baseUrl + '/api/threads';
            var params = { params: { cursorAfter: self.cursorAfter } };

            ajax({
                before: function() { self.unmount(); },
                loadingIconContainer: getView(self.threadList),
                request: axios.get(url, params),
                success: function(response) {
                    self.threadList.loadMoreThreads(response.data);
                }
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
    }
};
