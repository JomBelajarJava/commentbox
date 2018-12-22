function LoadMoreReplies(replyList, cursorAfter) {
    this.replyList = replyList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreReplies.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            var url = baseUrl + '/api/thread/' +
                self.replyList.thread.props.id +
                '/comments?cursorAfter=' + self.cursorAfter;

            ajax({
                before: function() { self.unmount(); },
                loadingIconContainer: getView(self.replyList),
                request: axios.get(url),
                success: function(response) {
                    self.replyList.loadMoreReplies(response.data);
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
                       text: 'Load more replies'
                   })
                  )
               );
    },

    mount: function() {
        getView(this.replyList).appendChild(getView(this));
    },

    unmount: function() {
        getView(this.replyList).removeChild(getView(this));
    }
};
