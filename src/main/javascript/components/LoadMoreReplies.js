function LoadMoreReplies(replyList, cursorAfter) {
    this.replyList = replyList;  // context
    this.cursorAfter = cursorAfter;
    this.view = null;
}

LoadMoreReplies.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            ajax({
                method: 'GET',
                url: baseUrl + '/api/thread/' + self.replyList.thread.props.id +
                    '/comments?cursorAfter=' + self.cursorAfter,
                parse: true,
                success: function(replies) {
                    self.replyList.loadMoreReplies(replies);
                }
            });
        };
    },

    render: function() {
        this.view = wrap(
            make('a', {
                href: '#',
                onclick: this.loadMoreListener(this),
                text: 'Load more replies'
            }),
            'li', { class: 'load-more' }
        );
    },

    mount: function() {
        getView(this.replyList).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.replyList).removeChild(getView(this));
        this.replyList.loadMore = null;
    }
};
