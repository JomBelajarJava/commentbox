function LoadMoreReplies(context, cursorAfter) {
    this.context = context;  // ReplyList
    this.cursorAfter = cursorAfter;
    this.view = null;
}

LoadMoreReplies.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            ajax({
                method: 'GET',
                url: baseUrl + '/api/thread/' +
                    self.context.context.thread.id +
                    '/comments?cursorAfter=' + self.cursorAfter,
                parse: true,
                success: function(moreReplies) {
                    self.context.loadMoreReplies(moreReplies);
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
        getView(this.context).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.context).removeChild(getView(this));
        this.context.loadMore = null;
    }
};
