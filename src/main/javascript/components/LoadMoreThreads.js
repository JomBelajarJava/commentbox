function LoadMoreThreads(threadList, cursorAfter) {
    this.threadList = threadList;  // context
    this.cursorAfter = cursorAfter;
    this.view = null;
}

LoadMoreThreads.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            $.ajax({
                url: baseUrl + '/api/threads?cursorAfter=' + self.cursorAfter,
                crossDomain: true,
                success: function(response) {
                    self.threadList.loadMoreThreads(response.data);
                }
            });
        };
    },

    render: function() {
        var link = $('<a/>')
            .attr('href', '#')
            .click(this.loadMoreListener(this))
            .text('Load more comments');

        this.view = $('<li/>').addClass('load-more').append(link);
    },

    mount: function() {
        getView(this.threadList).append(getView(this));
    },

    unmount: function() {
        getView(this).remove();
        this.threadList.loadMore = null;
    }
};
