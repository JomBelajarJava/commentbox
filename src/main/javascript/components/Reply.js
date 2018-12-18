function Reply(replyList, reply) {
    this.replyList = replyList;  // context
    this.props = reply;
    this.view = null;
}

Reply.prototype = {
    render: function() {
        var name = wrap(make('b', { text: this.props.username }), 'p');
        var text = make('p' , { text: this.props.text });

        if (this.props.isRecent) {
            this.view = group([name, text], 'li', { class: 'recent-reply' });
        } else {
            this.view = group([name, text], 'li');
        }
    },

    mount: function() {
        getView(this.replyList).appendChild(getView(this));
    }
};
