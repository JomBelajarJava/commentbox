function LoadMoreReplies(replyList, cursorAfter) {
    this.replyList = replyList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreReplies.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var loadingIcon = ui('div', { class: 'loader' });
            var element = getView(self);

            // Explicitly set height so the loading icon will not push other
            // elements.
            var container = getView(self.replyList);
            container.height(container.height());

            // Replace this element with loading icon.
            element.before(loadingIcon).remove();

            var threadId = self.replyList.thread.props.id;

            $.ajax({
                url: baseUrl + '/api/thread/' + threadId +
                    '/comments?cursorAfter=' + self.cursorAfter,
                success: function(data) {
                    loadingIcon.remove();
                    self.replyList.loadMoreReplies(data);
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
                   text: 'Load more replies'
               })
              )
        );
    },

    mount: function() {
        getView(this.replyList).append(getView(this));
    },

    unmount: function() {
        getView(this).remove();
        // this.replyList.loadMore = null;
    }
};
