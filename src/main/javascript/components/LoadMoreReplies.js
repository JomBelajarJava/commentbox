function LoadMoreReplies(replyList, cursorAfter) {
    this.replyList = replyList;  // context
    this.cursorAfter = cursorAfter;
}

LoadMoreReplies.prototype = {
    loadMoreListener: function(self) {
        return function(evt) {
            evt.preventDefault();

            self.unmount();

            var loader = ui('div', { class: 'loader' });
            getView(self.replyList).appendChild(loader);
            updateHeight(self.replyList);

            var url = baseUrl + '/api/thread/' + self.replyList.thread.props.id +
                '/comments?cursorAfter=' + self.cursorAfter;

            axios
                .get(url)
                .then(function(response) {
                    getView(self.replyList).removeChild(loader);
                    self.replyList.loadMoreReplies(response.data);
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
        attach(this, this.replyList);
    },

    unmount: function() {
        detach(this, this.replyList);
    }
};
