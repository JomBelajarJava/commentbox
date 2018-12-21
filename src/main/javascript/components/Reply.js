function Reply(replyList, reply) {
    this.replyList = replyList;  // context
    this.props = reply;
}

Reply.prototype = {
    render: function() {
        var attr = null;
        if (this.props.isRecent) {
            attr = { class: 'recent' };
        }

        setView(this,
            ui('li', attr, [
                ui('p', null, ui('b', { text: this.props.username })),
                ui('p', { text: this.props.text })
            ])
        );
    },

    mount: function() {
        attach(this, this.replyList);
    }
};
