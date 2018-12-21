function LoadMoreThreads(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreThreads.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            self.unmount();

            var loader = ui('div', { class: 'loader' });
            getView(self.threadList).appendChild(loader);
            updateHeight(self.threadList);

            axios
                .get(baseUrl + '/api/threads', {
                    params: { cursorAfter: self.cursorAfter }
                })
                .then(function(response) {
                    getView(self.threadList).removeChild(loader);
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
        attach(this, this.threadList);
    },

    unmount: function() {
        detach(this, this.threadList);
    }
};
