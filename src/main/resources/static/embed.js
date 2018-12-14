(function () {
    var baseUrl = 'http://localhost:8080';
    var commentbox = document.getElementById('jombelajarjava-commentbox');

    var showReplies = function (container, replies) {
        var ul = document.createElement('ul');

        for (var i = 0; i < replies.length; i++) {
            var reply = replies[i];

            var li = document.createElement('li');

            var commentText = reply.text + ' - ' + reply.username + '.';
            var comment = document.createTextNode(commentText);
            li.appendChild(comment);

            ul.appendChild(li);
        }

        container.appendChild(ul);
        container.setAttribute('data-replies-loaded', 'true');
    };

    var hideReplies = function (container) {
        container.removeChild(container.lastChild);
        container.setAttribute('data-replies-loaded', 'false');
    };

    var requestReplies = function (link) {
        var url = link.getAttribute('href');

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                showReplies(link.parentElement, response.data);
            }
        };
        xhr.send();
    };

    var loadReplies = function (evt) {
        evt.preventDefault();
        var link = evt.target;
        var container = link.parentElement;
        var loaded = container.getAttribute('data-replies-loaded');

        if (loaded === 'false') {
            requestReplies(link);
        } else {
            hideReplies(container);
        }
    };

    /*
     * Create reply text according to number of replies. 0 replies is just a
     * text, more than 0 will be a link.
     */
    var createReplyText = function (thread) {
        var replyText = document.createTextNode(thread.repliesCount + ' reply');

        if (thread.repliesCount > 0) {
            var url = baseUrl + '/api/thread/' + thread.id + '/comments';

            var a = document.createElement('a');
            a.setAttribute('class', 'jombelajarjava-reply-link');
            a.setAttribute('href', url);
            a.addEventListener('click', loadReplies);
            a.appendChild(replyText);

            return a;
        }
        return replyText;
    };

    var initThreads = function (threads) {
        var ul = document.createElement('ul');

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            var li = document.createElement('li');
            li.setAttribute('data-replies-loaded', 'false');

            var commentText = thread.text + ' - ' + thread.username + '. ';
            var comment = document.createTextNode(commentText);
            li.appendChild(comment);

            var replyText = createReplyText(thread);
            li.appendChild(replyText);

            ul.appendChild(li);
        }

        commentbox.appendChild(ul);
    };

    var loadThreads = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8080/api/threads", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                initThreads(response.data);
            }
        };
        xhr.send();
    };

    loadThreads();
})();
