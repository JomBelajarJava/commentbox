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
        var self = this;

        self.context = context;  // Thread

        self.nameInput = null;
        self.replyInput = null;
        self.form = null;

        self.unmount = function() {
            // replace this form with reply link
            self.context.view().replaceChild(self.context.replyLink, self.form);
        };

        self.cancelListener = function(evt) {
            evt.preventDefault();
            self.unmount();
        };

        self.submitListener = function(evt) {
            evt.preventDefault();

            ajax({
                method: 'POST',
                url: baseUrl + '/api/thread/' + self.context.id + '/comment',
                success: function(data) {
                    self.unmount();
                },
                data: {
                    username: self.nameInput.value,
                    text: self.replyInput.value
                }
            });
        };

        self.init = function() {
            self.nameInput = make('input', {
                type: 'text',
                placeholder: 'Name'
            });
            self.replyInput = make('textarea', {
                rows: 4,
                placeholder: 'Write reply'
            });

            var name = wrap(self.nameInput, 'p');
            var reply = wrap(self.replyInput, 'p');
            var cancel = wrap(
                make('a', {
                    href: '#',
                    onclick: self.cancelListener,
                    text: 'Cancel'
                }),
                'p'
            );
            var submit = wrap(
                make('a', {
                    href: '#',
                    onclick: self.submitListener,
                    text: 'Post reply'
                }),
                'p'
            );

            self.form = group([name, reply, cancel, submit], 'div');
        };

        self.view = function() {
            if (self.form === null) {
                self.init();
            }

            return self.form;
        };

        self.mount = function() {
            // replace reply link with this form
            self.context.view().replaceChild(
                self.view(),
                self.context.replyLink
            );
        };
    }

    function Reply(context, reply) {
        var self = this;
        self.context = context;  // ReplyList
        self.id = reply.id;
        self.username = reply.username;
        self.text = reply.text;
        self.created = reply.created;
        self.cursorAfter = reply.cursorAfter;

        self.view = function() {
            var name = wrap(make('b', {text: self.username}), 'p');
            var text = make('p' , {text: self.text});
            return group([name, text], 'li');
        };

        self.mount = function() {
            self.context.list.appendChild(self.view());
        };
    }

    function ReplyList(context, replies) {
        var self = this;

        self.context = context;  // Thread

        self.replies = (function() {
            var result = [];
            for (var i = 0; i < replies.length; i++) {
                var reply = new Reply(self, replies[i]);
                result.push(reply);
            }
            return result;
        })();

        self.list = null;

        self.init = function() {
            self.list = make('ul');
            for (var i = 0; i < self.replies.length; i++) {
                self.replies[i].mount();
            }
        };

        self.view = function() {
            if (self.list === null) {
                self.init();
            }
            return self.list;
        };

        self.mount = function() {
            self.context.view().appendChild(self.view());
        };

        self.unmount = function() {
            self.context.container.removeChild(self.list);
        };
    }

    function Thread(context, thread) {
        var self = this;

        self.context = context;  // ThreadList
        self.id = thread.id;
        self.username = thread.username;
        self.text = thread.text;
        self.created = thread.created;
        self.repliesCount = thread.repliesCount;
        self.cursorAfter = thread.cursorAfter;

        self.viewReplyLink = null;
        self.container = null;
        self.replyLink = null;
        self.replyList = null;

        self.repliesLoaded = false;

        self.chooseWord = function() {
            if (self.repliesCount == 1) {
                return 'View reply';
            }
            return 'View ' + self.repliesCount + ' replies';
        };

        self.hideReplies = function() {
            self.replyList.unmount();
            self.viewReplyLink.firstChild.nodeValue = self.chooseWord();
            self.repliesLoaded = false;
        };

        self.showReplies = function(replies) {
            self.replyList = new ReplyList(self, replies);
            self.replyList.mount();
            self.viewReplyLink.firstChild.nodeValue = 'Hide replies';
            self.repliesLoaded = true;
        };

        self.viewReplyListener = function(evt) {
            evt.preventDefault();

            if (self.repliesLoaded) {
                self.hideReplies();
            } else {
                ajax({
                    method: 'GET',
                    url: baseUrl + '/api/thread/' + self.id + '/comments',
                    success: self.showReplies,
                    parse: true
                });
            }
        };

        self.replyListener = function(evt) {
            evt.preventDefault();

            self.replyForm = new ReplyForm(self);
            self.replyForm.mount();
        };

        self.init = function() {
            self.viewReplyLink = make('a', {
                class: 'jombelajarjava-view-reply-link',
                href: self.repliesLink,
                onclick: self.viewReplyListener,
                text: self.chooseWord()
            });

            self.replyLink = wrap(
                make('a', {
                    href: '#',
                    onclick: self.replyListener,
                    text: 'Reply'
                }),
                'p'
            );

            var name = wrap(make('b', {text: self.username}), 'p');
            var text = make('p' , {text: self.text});
            var viewReply = wrap(self.viewReplyLink, 'p');

            var elements = [name, text];
            if (self.repliesCount > 0) {
                elements.push(viewReply);
            }
            elements.push(self.replyLink);

            self.container = group(elements, 'li');
        };

        self.view = function() {
            if (self.container === null) {
                self.init();
            }
            return self.container;
        };

        self.mount = function() {
            self.context.list.appendChild(self.view());
        };
    }

    function ThreadList(context, threads) {
        var self = this;
        context['threadList'] = this;

        self.context = context;
        self.threads = (function() {
            var result = [];
            for (var i = 0; i < threads.length; i++) {
                var thread = new Thread(self, threads[i]);
                result.push(thread);
            }
            return result;
        })();

        self.list = null;

        self.prepend = function(thread) {
            var t = new Thread(self, thread);
            self.threads.unshift(thread);
            self.list.insertBefore(t.view(), self.list.firstChild);
        };

        self.init = function() {
            self.list = make('ul');
            for (var i = 0; i < self.threads.length; i++) {
                self.threads[i].mount();
            }
        };

        self.view = function() {
            if (self.list === null) {
                self.init();
            }
            return self.list;
        };

        self.mount = function() {
            self.context.root.appendChild(self.view());
        };
    }

    function ThreadForm(context) {
        var self = this;
        context['threadForm'] = this;

        self.context = context;
        self.usernameInput = null;
        self.commentInput = null;
        self.submitButton = null;

        self.showNewThread = function(thread) {
            self.context.threadList.prepend(thread);
            self.commentInput.value = '';
        };

        self.openThread = function(evt) {
            evt.preventDefault();

            ajax({
                method: 'POST',
                url: baseUrl + '/api/thread',
                success: self.showNewThread,
                parse: true,
                data: {
                    username: self.usernameInput.value,
                    text: self.commentInput.value
                }
            });
        };

        self.init = function() {
            self.usernameInput = make( 'input', {
                type: 'text',
                placeholder: 'Name'
            });

            self.commentInput = make('textarea', {
                rows: 4,
                placeholder: 'Write comment'
            });

            self.submitButton = make('a', {
                href: '#',
                onclick: self.openThread,
                text: 'Post comment'
            });
        };

        self.view = function() {
            self.init();
            var username = wrap(self.usernameInput, 'p');
            var comment = wrap(self.commentInput, 'p');
            var submit = wrap(self.submitButton, 'p');
            return group([username, comment, submit], 'div');
        };

        this.mount = function () {
            self.context.root.appendChild(self.view());
        };
    }

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
