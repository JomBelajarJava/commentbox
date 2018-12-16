(function () {
    var baseUrl = 'http://localhost:8080';
    var context = {
        root: document.getElementById('jombelajarjava-commentbox')
    };

    // TODO: remove this
    var persistReply = function (container, name, reply) {
        var comment = createComment({username: name, text: reply});
        var ul = document.createElement('ul');
        ul.appendChild(comment);

        container.parentElement.replaceChild(ul, container);
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
        this.render = null;
    }

    ReplyForm.prototype = {
        unmount: function() {
            // replace this form with reply link
            this.context.view().replaceChild(
                this.context.replyLink,
                this.render
            );
        },

        cancelListener: function(context) {
            return function(evt) {
                evt.preventDefault();
                context.unmount();
            };
        },

        submitListener: function(context) {
            return function(evt) {
                evt.preventDefault();

                ajax({
                    method: 'POST',
                    url: baseUrl + '/api/thread/' +
                        context.context.thread.id + '/comment',
                    success: function(data) {
                        context.unmount();
                    },
                    data: {
                        username: context.nameInput.value,
                        text: context.replyInput.value
                    }
                });
            };
        },

        init: function() {
            this.nameInput = make('input', {
                type: 'text',
                placeholder: 'Name'
            });
            this.replyInput = make('textarea', {
                rows: 4,
                placeholder: 'Write reply'
            });

            var name = wrap(this.nameInput, 'p');
            var reply = wrap(this.replyInput, 'p');
            var cancel = wrap(
                make('a', {
                    href: '#',
                    onclick: this.cancelListener(this),
                    text: 'Cancel'
                }),
                'p'
            );
            var submit = wrap(
                make('a', {
                    href: '#',
                    onclick: this.submitListener(this),
                    text: 'Post reply'
                }),
                'p'
            );

            this.render = group([name, reply, cancel, submit], 'div');
        },

        view: function() {
            if (this.render === null) {
                this.init();
            }
            return this.render;
        },

        mount: function() {
            // replace reply link with this form
            this.context.view().replaceChild(
                this.view(),
                this.context.replyLink
            );
        }
    };

    function Reply(context, reply) {
        this.context = context;  // ReplyList
        this.reply = reply;
    }

    Reply.prototype = {
        view: function() {
            var name = wrap(make('b', {text: this.reply.username}), 'p');
            var text = make('p' , {text: this.reply.text});
            return group([name, text], 'li');
        },

        mount: function() {
            this.context.view().appendChild(this.view());
        }
    };

    function ReplyList(context, replies) {
        this.context = context;  // Thread
        this.replies = [];
        this.render = null;

        for (var i = 0; i < replies.length; i++) {
            var reply = new Reply(this, replies[i]);
            this.replies.push(reply);
        }
    }

    ReplyList.prototype = {
        init: function() {
            this.render = make('ul');
            for (var i = 0; i < this.replies.length; i++) {
                this.replies[i].mount();
            }
        },

        view: function() {
            if (this.render === null) {
                this.init();
            }
            return this.render;
        },

        mount: function() {
            this.context.view().appendChild(this.view());
        },

        unmount: function() {
            this.context.view().removeChild(this.view());
        }
    };

    function Thread(context, thread) {
        this.context = context;  // ThreadList
        this.thread = thread;

        this.render = null;
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

        hideReplies: function() {
            this.replyList.unmount();
            this.viewReplyLink.firstChild.nodeValue = this.chooseWord();
            this.repliesLoaded = false;
        },

        showReplies: function(context) {
            return function(replies) {
                context.replyList = new ReplyList(context, replies);
                context.replyList.mount();
                context.viewReplyLink.firstChild.nodeValue = 'Hide replies';
                context.repliesLoaded = true;
            };
        },

        viewReplyListener: function(context) {
            return function(evt) {
                evt.preventDefault();

                if (context.repliesLoaded) {
                    context.hideReplies();
                } else {
                    ajax({
                        method: 'GET',
                        url: baseUrl + '/api/thread/' +
                            context.thread.id + '/comments',
                        success: context.showReplies(context),
                        parse: true
                    });
                }
            };
        },

        replyListener: function(context) {
            return function(evt) {
                evt.preventDefault();

                context.replyForm = new ReplyForm(context);
                context.replyForm.mount();
            };
        },

        init: function() {
            this.viewReplyLink = make('a', {
                class: 'jombelajarjava-view-reply-link',
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
                'p'
            );

            var name = wrap(make('b', {text: this.thread.username}), 'p');
            var text = make('p' , {text: this.thread.text});
            var viewReply = wrap(this.viewReplyLink, 'p');

            var elements = [name, text, viewReply, this.replyLink];

            this.render = group(elements, 'li');
        },

        view: function() {
            if (this.render === null) {
                this.init();
            }
            return this.render;
        },

        mount: function() {
            this.context.view().appendChild(this.view());
        }
    };

    function ThreadList(context, threads) {
        context['threadList'] = this;

        this.context = context;
        this.threads = [];
        this.render = null;

        for (var i = 0; i < threads.length; i++) {
            var thread = new Thread(this, threads[i]);
            this.threads.push(thread);
        }
    }

    ThreadList.prototype = {
        prepend: function(data) {
            var thread = new Thread(this, data);
            this.threads.unshift(data);
            this.render.insertBefore(thread.view(), this.render.firstChild);
        },

        init: function() {
            this.render = make('ul');
            for (var i = 0; i < this.threads.length; i++) {
                this.threads[i].mount();
            }
        },

        view: function() {
            if (this.render === null) {
                this.init();
            }
            return this.render;
        },

        mount: function() {
            this.context.root.appendChild(this.view());
        }
    };

    function ThreadForm(context) {
        context['threadForm'] = this;

        this.context = context;
        this.usernameInput = null;
        this.commentInput = null;
        this.submitButton = null;
    }

    ThreadForm.prototype = {
        showNewThread: function(context) {
            return function(thread) {
                context.context.threadList.prepend(thread);
                context.commentInput.value = '';
            };
        },

        openThread: function(context) {
            return function(evt) {
                evt.preventDefault();

                ajax({
                    method: 'POST',
                    url: baseUrl + '/api/thread',
                    success: context.showNewThread(context),
                    parse: true,
                    data: {
                        username: context.usernameInput.value,
                        text: context.commentInput.value
                    }
                });
            };
        },

        init: function() {
            this.usernameInput = make( 'input', {
                type: 'text',
                placeholder: 'Name'
            });

            this.commentInput = make('textarea', {
                rows: 4,
                placeholder: 'Write comment'
            });

            this.submitButton = make('a', {
                href: '#',
                onclick: this.openThread(this),
                text: 'Post comment'
            });
        },

        view: function() {
            this.init();
            var username = wrap(this.usernameInput, 'p');
            var comment = wrap(this.commentInput, 'p');
            var submit = wrap(this.submitButton, 'p');
            return group([username, comment, submit], 'div');
        },

        mount: function () {
            this.context.root.appendChild(this.view());
        }
    };

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
