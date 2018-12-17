function Reply(context, reply) {
    this.context = context;  // ReplyList
    this.reply = reply;
    this.view = null;
}

Reply.prototype = {
    render: function() {
        var name = wrap(make('b', {text: this.reply.username}), 'p');
        var text = make('p' , {text: this.reply.text});

        if (this.reply.isRecent) {
            this.view = group([name, text], 'li', { class: 'recent-reply' });
        } else {
            this.view = group([name, text], 'li');
        }
    },

    mount: function() {
        getView(this.context).appendChild(getView(this));
    }
};
