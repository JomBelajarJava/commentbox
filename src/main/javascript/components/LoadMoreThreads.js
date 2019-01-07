function LoadMoreThreads(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreThreads.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var loadingIcon = ui('div', { class: 'loader' });
            var element = getView(self);

            // Explicitly set height so the loading icon will not push other
            // elements.
            var container = getView(self.threadList);
            container.height(container.height());

            // Replace this element with loading icon.
            element.before(loadingIcon).remove();

            $.ajax({
                url: baseUrl + '/api/threads?cursorAfter=' + self.cursorAfter,
                success: function(data) {
                    loadingIcon.remove();
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
    }
};
