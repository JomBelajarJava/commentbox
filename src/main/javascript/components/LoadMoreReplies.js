function LoadMoreReplies(replyList, cursorAfter) {
    this.replyList = replyList;  // context
    this.cursorAfter = cursorAfter;
    this.view = null;
}

LoadMoreReplies.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            $.ajax({
                url: baseUrl + '/api/thread/' + self.replyList.thread.props.id +
                    '/comments?cursorAfter=' + self.cursorAfter,
                dataType: 'jsonp',
                success: function(response) {
                    self.replyList.loadMoreReplies(response.data);
                }
            });
        };
    },

    render: function() {
        var link = $('<a/>')
            .attr('href', '#')
            .click(this.loadMoreListener(this))
            .text('Load more replies');

        this.view = $('<li/>')
            .addClass('load-more')
            .append(link);
    },

    mount: function() {
        getView(this.replyList).append(getView(this));
    },

    unmount: function() {
        getView(this).remove();
        this.replyList.loadMore = null;
    }
};
