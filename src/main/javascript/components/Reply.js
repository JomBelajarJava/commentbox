function Reply(replyList, reply) {
    this.replyList = replyList;  // context
    this.props = reply;
    this.view = null;
}

Reply.prototype = {
    render: function() {
        var boldName = $('<b/>').text(this.props.username);
        var name = $('<p/>').append(boldName);
        var text = $('<p/>').text(this.props.text);

        if (this.props.isRecent) {
            this.view = $('<li/>')
                .addClass('recent-reply')
                .append(name, text);
        } else {
            this.view = $('<li/>').append(name, text);
        }
    },

    mount: function() {
        getView(this.replyList).append(getView(this));
    }
};
