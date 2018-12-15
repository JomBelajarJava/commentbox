(function () {
    var baseUrl = 'http://localhost:8080';
    var commentbox = document.getElementById('jombelajarjava-commentbox');
    var threadInput = {};
    var threadList;

    /*
     * Format comment, return as list element.
     */
    var createComment = function(comment) {
        var username = document.createElement('p');
        var bold = document.createElement('b');
        var usernameText = document.createTextNode(comment.username);
        bold.appendChild(usernameText);
        username.appendChild(bold);

        var text = document.createElement('p');
        var textNode = document.createTextNode(comment.text);
        text.appendChild(textNode);

        var li = document.createElement('li');
        li.appendChild(username);
        li.appendChild(text);

        return li;
    };

    /*
     * Group inputs into a div container.
     */
    var createForm = function (children) {
        var form = document.createElement('div');

        for (var i = 0; i < children.length; i++) {
            var container = document.createElement('p');
            container.appendChild(children[i]);
            form.appendChild(container);
        }

        return form;
    };

    /*
     * Show replies by making ul element inside li element of the thread.
     */
    var showReplies = function (link, replies) {
        var container = link.parentElement.parentElement;  // li > p > a
        var ul = document.createElement('ul');

        for (var i = 0; i < replies.length; i++) {
            var li = createComment(replies[i]);
            ul.appendChild(li);
        }

        container.appendChild(ul);
        link.setAttribute('data-replies-loaded', 'true');
        link.setAttribute('data-prev-text', link.firstChild.nodeValue);
        link.firstChild.nodeValue = 'Hide replies';
    };

    /*
     * Hide replies by removing the last element of li element of the thread.
     */
    var hideReplies = function (link) {
        var container = link.parentElement.parentElement;  // li > p > a
        container.removeChild(container.lastChild);
        link.setAttribute('data-replies-loaded', 'false');
        link.firstChild.nodeValue = link.getAttribute('data-prev-text');
    };

    /*
     * Request replies from server.
     */
    var requestReplies = function (link) {
        var url = link.getAttribute('href');

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                showReplies(link, response.data);
            }
        };
        xhr.send();
    };

    /*
     * Event listener that will load replies if hasn't and hide otherwise.
     */
    var loadReplies = function (evt) {
        evt.preventDefault();
        var link = evt.target;
        var loaded = link.getAttribute('data-replies-loaded');

        if (loaded === 'false') {
            requestReplies(link);
        } else {
            hideReplies(link);
        }
    };

    /*
     * Singular/plural thing.
     */
    

    /*
     * Create view reply text according to number of replies. 0 replies is just
     * a text, more than 0 will be a link.
     */
    var createViewReplyLink = function (thread) {
        var viewReplyText = chooseWord(thread.repliesCount);
        var viewReplyTextNode = document.createTextNode(viewReplyText);
        var url = baseUrl + '/api/thread/' + thread.id + '/comments';

        var a = document.createElement('a');
        a.setAttribute('class', 'jombelajarjava-view-reply-link');
        a.setAttribute('href', url);
        a.setAttribute('data-replies-loaded', 'false');
        a.addEventListener('click', loadReplies);
        a.appendChild(viewReplyTextNode);

        var p = document.createElement('p');
        p.appendChild(a);

        return p;
    };

    var cancelReply = function (evt) {
        evt.preventDefault();
        var link = evt.target;
        var url = link.getAttribute('href');
        var container = link.parentElement.parentElement;  // div > p > a

        var replyLink = createReplyLink(url);
        container.parentElement.replaceChild(replyLink, container);
    };

    var persistReply = function (container, name, reply) {
        var comment = createComment({username: name, text: reply});
        var ul = document.createElement('ul');
        ul.appendChild(comment);

        container.parentElement.replaceChild(ul, container);
    };

    var sendReply = function (evt) {
        evt.preventDefault();
        var link = evt.target;
        var url = link.getAttribute('href');
        var linkContainer = link.parentElement;  // p
        var replyTextContainer = linkContainer
            .previousElementSibling   // cancel link p
            .previousElementSibling;  // textarea p
        var replyText = replyTextContainer.firstChild;
        var username = replyTextContainer.previousElementSibling.firstChild;
        var container = linkContainer.parentElement;

        var data = JSON.stringify({
            username: username.value,
            text: replyText.value
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                persistReply(container, username.value, replyText.value);
            }
        };
        xhr.send(data);
    };

    var createReplyForm = function (url) {
        var usernameInput = document.createElement('input');
        usernameInput.setAttribute('type', 'text');
        usernameInput.setAttribute('placeholder', 'Name');

        var commentInput = document.createElement('textarea');
        commentInput.setAttribute('rows', 4);
        commentInput.setAttribute('placeholder', 'Write reply');

        var cancelText = document.createTextNode('Cancel');
        var cancelButton = document.createElement('a');
        cancelButton.setAttribute('href', url);
        cancelButton.addEventListener('click', cancelReply);
        cancelButton.appendChild(cancelText);

        var submitText = document.createTextNode('Post reply');
        var submitButton = document.createElement('a');
        submitButton.setAttribute('href', url);
        submitButton.addEventListener('click', sendReply);
        submitButton.appendChild(submitText);

        var form = createForm(
            [usernameInput, commentInput, cancelButton, submitButton]);

        return form;
    };

    /*
     * Show reply form by replacing the reply link with it.
     */
    var showReplyForm = function (evt) {
        evt.preventDefault();
        var link = evt.target;
        var linkContainer = link.parentElement;
        var url = link.getAttribute('href');

        var replyForm = createReplyForm(url);
        linkContainer.parentElement.replaceChild(replyForm, linkContainer);
    };

    /*
     * Create reply link for each thread.
     */
    var createReplyLink = function (url) {
        var a = document.createElement('a');
        a.setAttribute('class', 'jombelajarjava-reply-link');
        a.setAttribute('href', url);
        a.addEventListener('click', showReplyForm);
        a.appendChild(document.createTextNode('Reply'));

        var p = document.createElement('p');
        p.appendChild(a);

        return p;
    };

    /*
     * Create list item for thread.
     */
    var createThread = function (thread) {
        var url = baseUrl + '/api/thread/' + thread.id + '/comment';
        var li = createComment(thread);

        if (thread.repliesCount > 0) {
            li.appendChild(createViewReplyLink(thread));
        }
        li.appendChild(createReplyLink(url));

        return li;
    };

    function ReplyForm(parent, replyLink) {
        var self = this;

        self.parent = parent;
        self.replyLink = replyLink;

        self.form = null;

        self.cancelListener = function(evt) {
            evt.preventDefault();
            self.parent.replaceChild(self.replyLink, self.form);
        };

        self.init = function() {
            var name = wrap(make('input', {type: 'text',
                                           placeholder: 'Name'}),
                            'p');
            var reply = wrap(make('textarea', {rows: 4,
                                               placeholder: 'Write reply'}),
                             'p');
            var cancel = wrap(make('a', {href: '#',
                                         onclick: self.cancelListener,
                                         text: 'Cancel'}),
                              'p');
            var submit = wrap(make('a', {href: '#', text: 'Post reply'}),
                              'p');

            self.form = group([name, reply, cancel, submit], 'div');
        };

        self.view = function() {
            if (self.form === null) {
                self.init();
            }

            return self.form;
        };

        self.mount = function() {
            self.parent.replaceChild(self.view(), self.replyLink);
        };
    }

    function Reply(reply) {
        var self = this;
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
    }

    function ReplyList(replies) {
        var self = this;

        self.container = null;

        self.list = (function() {
            var list = [];
            for (var i = 0; i < replies.length; i++) {
                var reply = new Reply(replies[i]);
                list.push(reply);
            }
            return list;
        })();

        self.view = function() {
            self.container = make('ul');
            for (var i = 0; i < self.list.length; i++) {
                self.container.appendChild(self.list[i].view());
            }
            return self.container;
        };

        self.mount = function(parent) {
            parent.appendChild(self.view());
        };
    }

    function ThreadList(threads) {
        var self = this;

        self.threads = (function() {
            var list = [];
            for (var i = 0; i < threads.length; i++) {
                var thread = new Thread(threads[i]);
                list.push(thread);
            }
            return list;
        })();

        self.list = null;

        self.prepend = function(thread) {
            var t = new Thread(thread);
            self.threads.push(thread);
            self.list.insertBefore(t.view(), self.list.firstChild);
        };

        self.init = function() {
            self.list = make('ul');
            for (var i = 0; i < self.threads.length; i++) {
                self.list.appendChild(self.threads[i].view());
            }
        };

        self.view = function() {
            if (self.list === null) {
                self.init();
            }
            return self.list;
        };

        self.mount = function(root) {
            root.appendChild(self.view());
        };
    }

    function Thread(thread) {
        var self = this;
        self.id = thread.id;
        self.username = thread.username;
        self.text = thread.text;
        self.created = thread.created;
        self.repliesCount = thread.repliesCount;
        self.cursorAfter = thread.cursorAfter;

        self.viewReplyLink = null;
        self.container = null;
        self.replyLink = null;
        self.replyForm = null;
        self.replyList = null;

        self.repliesLoaded = false;
        self.repliesLink = baseUrl + '/api/thread/' + self.id + '/comments';

        self.chooseWord = function() {
            if (self.repliesCount == 1) {
                return 'View reply';
            }
            return 'View ' + self.repliesCount + ' replies';
        };

        self.hideReplies = function() {
            self.container.removeChild(self.replyList.container);
            self.viewReplyLink.firstChild.nodeValue = self.chooseWord();
            self.repliesLoaded = false;
        };

        self.showReplies = function(replies) {
            self.replyList = new ReplyList(replies);
            self.replyList.mount(self.container);
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
                    url: self.repliesLink,
                    success: self.showReplies
                });
            }
        };

        self.replyListener = function(evt) {
            evt.preventDefault();

            self.replyForm = new ReplyForm(self.container, self.replyLink);
            self.replyForm.mount();
        };

        self.init = function() {
            self.viewReplyLink =
                make('a', {class: 'jombelajarjava-view-reply-link',
                           href: self.repliesLink,
                           onclick: self.viewReplyListener,
                           text: self.chooseWord()});

            var replyAnchor = make('a', {href: '#',
                                         onclick: self.replyListener,
                                         text: 'Reply'});

            var name = wrap(make('b', {text: self.username}), 'p');
            var text = make('p' , {text: self.text});
            var viewReply = wrap(self.viewReplyLink, 'p');
            self.replyLink = wrap(replyAnchor, 'p');

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
    }

    /*
     * Request threads from server.
     */
    var requestThreads = function () {
        ajax({
            method: 'GET',
            url: baseUrl + '/api/threads/latest',
            success: function(threads) {
                threadList = new ThreadList(threads);
                threadList.mount(commentbox);
            }
        });
    };



    /*
     * Add submitted thread into the list.
     */
    var showNewThread = function (thread) {
        var li = createThread(thread);
        threadList.insertBefore(li, threadList.firstChild);
    };

    /*
     * Submit comment to server to open new thread.
     */
    var openThread = function (evt) {
        evt.preventDefault();

        var data = JSON.stringify({
            username: threadInput.username.value,
            text: threadInput.comment.value
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', baseUrl + '/api/thread', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                showNewThread(response.data);
            }
        };
        xhr.send(data);
    };

    var ajax = function(args) {
        // args = {method, url, success, data}
        var xhr = new XMLHttpRequest();
        xhr.open(args.method, args.url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                args.success(response.data);
            }
        };
        xhr.send(JSON.stringify(args.data));
    };

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

    var wrap = function(node, tagName, attributes) {
        var wrapper = make(tagName, attributes);
        wrapper.appendChild(node);

        return wrapper;
    };

    var group = function(nodes, tagName, attributes) {
        var group = make(tagName, attributes);
        for (var i = 0; i < nodes.length; i++) {
            group.appendChild(nodes[i]);
        }

        return group;
    };

    function ThreadForm() {
        var self = this;

        self.usernameInput = null;
        self.commentInput = null;
        self.submitButton = null;

        self.showNewThread = function(thread) {
            threadList.prepend(thread);
            self.commentInput.value = '';
        };

        self.openThread = function(evt) {
            evt.preventDefault();

            ajax({
                method: 'POST',
                url: baseUrl + '/api/thread',
                success: self.showNewThread,
                data: {
                    username: self.usernameInput.value,
                    text: self.commentInput.value
                }
            });
        };

        self.init = function() {
            self.usernameInput = make( 'input', {type: 'text',
                                                 placeholder: 'Name'});

            self.commentInput = make('textarea', {rows: 4,
                                                  placeholder: 'Write comment'});

            self.submitButton = make('a', {href: '#',
                                           onclick: self.openThread,
                                           text: 'Post comment'});
        };

        self.view = function() {
            self.init();
            var username = wrap(self.usernameInput, 'p');
            var comment = wrap(self.commentInput, 'p');
            var submit = wrap(self.submitButton, 'p');
            return group([username, comment, submit], 'div');
        };

        this.mount = function (root) {
            root.appendChild(self.view());
        };
    }

    var threadForm = new ThreadForm();
    threadForm.mount(commentbox);

    requestThreads();

    /*
     * Initialize commentbox.
     */
    // var init = function () {
    //     showThreadForm();
    //     requestThreads();
    // };

    // init();
})();
