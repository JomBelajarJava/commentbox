(function () {
    var baseUrl = 'http://localhost:8080';
    var context = {
        threadForm: null,
        threadList: null,
        replyForm: null,
        view: document.getElementById('jombelajarjava-commentbox')
    };

    /*
     * Get view rendered by the component.
     */
    var getView = function(component) {
        if (component.view === null) {
            component.render();
        }
        return component.view;
    };

    /*
     * Make an AJAX request. Takes argument object with properties:
     * method, url, success, data, parse
     */
    var ajax = function(args) {
        var xhr = new XMLHttpRequest();
        xhr.open(args.method, args.url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (args.parse) {
                    var response = JSON.parse(xhr.responseText);
                    args.success(response.data);
                } else {
                    args.success(xhr.responseText);
                }
            }
        };
        xhr.send(JSON.stringify(args.data));
    };

    /*
     * Create HTML element from tagName and attributes. 'onclick' attribute will
     * add as event listener. 'text' attribute will be the text node. Other
     * attributes will set as normal attributes.
     */
    var make = function(tagName, attributes) {
        var element = document.createElement(tagName);
        for (var prop in attributes) {
            if (prop === 'onclick') {
                element.addEventListener('click', attributes[prop]);
            } else if (prop === 'text') {
                var text = document.createTextNode(attributes[prop]);
                element.appendChild(text);
            } else {
                element.setAttribute(prop, attributes[prop]);
            }
        }

        return element;
    };

    /*
     * Wrap node inside a new element with given tagName and attributes.
     */
    var wrap = function(node, tagName, attributes) {
        var wrapper = make(tagName, attributes);
        wrapper.appendChild(node);

        return wrapper;
    };

    /*
     * Group several nodes inside a new element with given tagName and
     * attributes.
     */
    var group = function(nodes, tagName, attributes) {
        var group = make(tagName, attributes);
        for (var i = 0; i < nodes.length; i++) {
            group.appendChild(nodes[i]);
        }

        return group;
    };

    function ReplyForm(context) {
        this.context = context;  // Thread

        this.nameInput = null;
        this.replyInput = null;
        this.view = null;
    }

    ReplyForm.prototype = {
        cancelListener: function(self) {
            return function(evt) {
                evt.preventDefault();
                self.unmount();
            };
        },

        submitListener: function(self) {
            return function(evt) {
                evt.preventDefault();

                ajax({
                    method: 'POST',
                    url: baseUrl + '/api/thread/' +
                        self.context.thread.id + '/comment',
                    success: function(data) {
                        self.context.addReply({
                            username: self.nameInput.value,
                            text: self.replyInput.value,
                            isRecent: true
                        });
                        self.unmount();
                    },
                    data: {
                        username: self.nameInput.value,
                        text: self.replyInput.value
                    }
                });
            };
        },

        render: function() {
            this.nameInput = make('input', {
                type: 'text',
                placeholder: 'Name'
            });
            this.replyInput = make('textarea', {
                rows: 6,
                placeholder: 'Write reply'
            });

            var name = wrap(this.nameInput, 'p');
            var reply = wrap(this.replyInput, 'p');

            var cancel = make('a', {
                href: '#',
                onclick: this.cancelListener(this),
                text: 'Cancel'
            });
            var submit = make('a', {
                href: '#',
                onclick: this.submitListener(this),
                text: 'Post reply'
            });
            var buttons = group(
                [cancel, submit],
                'p', { class: 'form-buttons-container' }
            );

            this.view = group([name, reply, buttons], 'div');
        },

        mount: function() {
            // replace reply link with this form
            getView(this.context).replaceChild(
                getView(this),
                this.context.replyLink
            );
        },

        unmount: function() {
            // replace this form with reply link
            getView(this.context).replaceChild(
                this.context.replyLink,
                getView(this)
            );

            context.replyForm = null;
        },
    };

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

    function ReplyList(context, replies) {
        this.context = context;  // Thread
        this.replies = [];
        this.view = null;

        for (var i = 0; i < replies.length; i++) {
            var reply = new Reply(this, replies[i]);
            this.replies.push(reply);
        }
    }

    ReplyList.prototype = {
        prepend: function(data) {
            var reply = new Reply(this, data);
            this.replies.unshift(data);
            getView(this).insertBefore(getView(reply), getView(this).firstChild);
        },

        render: function() {
            this.view = make('ul');
            for (var i = 0; i < this.replies.length; i++) {
                this.replies[i].mount();
            }
        },

        mount: function() {
            getView(this.context).appendChild(getView(this));
        },

        unmount: function() {
            getView(this.context).removeChild(getView(this));
            this.context.replyList = null;
        }
    };

    function Thread(context, thread) {
        this.context = context;  // ThreadList
        this.thread = thread;

        this.view = null;
        this.viewReplyLink = null;
        this.replyLink = null;
        this.replyList = null;

        this.repliesLoaded = false;
    }

    Thread.prototype = {
        chooseWord: function() {
            if (this.thread.repliesCount === 0 ||
                this.thread.repliesCount === null) {
                return '';
            } else if (this.thread.repliesCount === 1) {
                return 'View reply';
            }
            return 'View ' + this.thread.repliesCount + ' replies';
        },

        addReply: function(data) {
            this.thread.repliesCount++;

            if (this.replyList === null) {
                this.viewReplyLink.firstChild.nodeValue = this.chooseWord();
            } else {
                this.replyList.prepend(data);
            }
        },

        hideReplies: function() {
            this.replyList.unmount();
            this.viewReplyLink.firstChild.nodeValue = this.chooseWord();
            this.repliesLoaded = false;
        },

        showReplies: function(self) {
            return function(replies) {
                self.replyList = new ReplyList(self, replies);
                self.replyList.mount();
                self.viewReplyLink.firstChild.nodeValue = 'Hide replies';
                self.repliesLoaded = true;
            };
        },

        viewReplyListener: function(self) {
            return function(evt) {
                evt.preventDefault();

                if (self.repliesLoaded) {
                    self.hideReplies();
                } else {
                    ajax({
                        method: 'GET',
                        url: baseUrl + '/api/thread/' +
                            self.thread.id + '/comments/earliest',
                        success: self.showReplies(self),
                        parse: true
                    });
                }
            };
        },

        replyListener: function(self) {
            return function(evt) {
                evt.preventDefault();

                if (context.replyForm !== null) {
                    context.replyForm.unmount();
                }
                context.replyForm = new ReplyForm(self);
                context.replyForm.mount();
            };
        },

        render: function() {
            this.viewReplyLink = make('a', {
                href: '#',
                onclick: this.viewReplyListener(this),
                text: this.chooseWord()
            });

            this.replyLink = wrap(
                make('a', {
                    href: '#',
                    onclick: this.replyListener(this),
                    text: 'Reply'
                }),
                'p', { class: 'reply-button' }
            );

            var name = wrap(make('b', {text: this.thread.username}), 'p');
            var text = make('p' , {text: this.thread.text});
            var viewReply = wrap(
                this.viewReplyLink,
                'p', { class: 'view-reply-button' }
            );

            var elements = [name, text, this.replyLink, viewReply];

            this.view = group(elements, 'li');
        },

        mount: function() {
            getView(this.context).appendChild(getView(this));
        }
    };

    function LoadMoreThread(context, cursorAfter) {
        this.context = context;  // ThreadList
        this.cursorAfter = cursorAfter;
        this.view = null;
    }

    LoadMoreThread.prototype = {
        loadMoreListener: function(self) {
            return function(evt) {
                evt.preventDefault();

                ajax({
                    method: 'GET',
                    url: baseUrl + '/api/threads?cursorAfter=' + self.cursorAfter,
                    parse: true,
                    success: function(moreThreads) {
                        self.context.loadMoreThreads(moreThreads);
                    }
                });
            };
        },

        render: function() {
            this.view = wrap(
                make('a', {
                    href: '#',
                    onclick: this.loadMoreListener(this),
                    text: 'Load more comments'
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

    function ThreadList(context, threads) {
        context.threadList = this;

        this.context = context;
        this.threads = [];
        this.loadMore = null;
        this.view = null;

        for (var i = 0; i < threads.length; i++) {
            var thread = new Thread(this, threads[i]);
            this.threads.push(thread);
        }
    }

    ThreadList.prototype = {
        prepend: function(data) {
            var thread = new Thread(this, data);
            this.threads.unshift(data);
            getView(this).insertBefore(getView(thread), getView(this).firstChild);
        },

        renderLoadMore: function() {
            var lastThread = this.threads[this.threads.length - 1];
            var cursorAfter = lastThread.thread.cursorAfter;
            if (cursorAfter !== null) {
                this.loadMore = new LoadMoreThread(this, cursorAfter);
                this.loadMore.mount();
            }
        },

        loadMoreThreads: function(moreThreads) {
            this.loadMore.unmount();

            for (var i = 0; i < moreThreads.length; i++) {
                var thread = new Thread(this, moreThreads[i]);
                this.threads.push(thread);
                thread.mount();
            }

            this.renderLoadMore();
        },

        render: function() {
            this.view = make('ul', { class: 'thread-list' });
            for (var i = 0; i < this.threads.length; i++) {
                this.threads[i].mount();
            }

            this.renderLoadMore();
        },

        mount: function() {
            getView(this.context).appendChild(getView(this));
        }
    };

    function ThreadForm(context) {
        context.threadForm = this;

        this.context = context;
        this.usernameInput = null;
        this.commentInput = null;
        this.submitButton = null;
        this.view = null;
    }

    ThreadForm.prototype = {
        showNewThread: function(self) {
            return function(thread) {
                self.context.threadList.prepend(thread);
                self.commentInput.value = '';
            };
        },

        openThread: function(self) {
            return function(evt) {
                evt.preventDefault();

                ajax({
                    method: 'POST',
                    url: baseUrl + '/api/thread',
                    success: self.showNewThread(self),
                    parse: true,
                    data: {
                        username: self.usernameInput.value,
                        text: self.commentInput.value
                    }
                });
            };
        },

        render: function() {
            this.usernameInput = make( 'input', {
                type: 'text',
                placeholder: 'Name'
            });

            this.commentInput = make('textarea', {
                rows: 6,
                placeholder: 'Write comment'
            });

            this.submitButton = make('a', {
                href: '#',
                onclick: this.openThread(this),
                text: 'Post comment'
            });

            var username = wrap(this.usernameInput, 'p');
            var comment = wrap(this.commentInput, 'p');
            var submit = wrap(
                this.submitButton,
                'p', { class: 'form-buttons-container' }
            );

            this.view = group([username, comment, submit], 'div');
        },

        mount: function () {
            getView(this.context).appendChild(getView(this));
        }
    };

    /*
     * Initialize comment box.
     */
    var init = function() {
        var threadForm = new ThreadForm(context);
        threadForm.mount();

        ajax({
            method: 'GET',
            url: baseUrl + '/api/threads/latest',
            parse: true,
            success: function(threads) {
                var threadList = new ThreadList(context, threads);
                threadList.mount();
            }
        });
    };

    init();
})();
