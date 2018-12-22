function Reply(replyList, reply) {
    this.replyList = replyList;  // context
    this.props = reply;
}

Reply.prototype = {
    render: function() {
        var attr = this.props.isRecent ? { class: 'recent' } : null;

        setView(this,
                ui('li', attr, [
                    ui('p', null, ui('b', { text: this.props.username })),
                    ui('p', { text: this.props.text })
                ])
               );
    },

    mount: function() {
        getView(this.replyList).appendChild(getView(this));
    }
};
