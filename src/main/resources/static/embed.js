(function () {
    var baseUrl = 'http://localhost:8080';
    var commentbox = document.getElementById('jombelajarjava-commentbox');

    /*
     * Format comment and append to the list element.
     */
    var appendComment = function(list, comment) {
        var username = document.createElement('p');
        var bold = document.createElement('b');
        var usernameText = document.createTextNode(comment.username);
        bold.appendChild(usernameText);
        username.appendChild(bold);

        var text = document.createElement('p');
        var textNode = document.createTextNode(comment.text);
        text.appendChild(textNode);

        list.appendChild(username);
        list.appendChild(text);
    };

    /*
     * Show replies by making ul element inside li element of the thread.
     */
    var showReplies = function (link, replies) {
        var container = link.parentElement.parentElement;  // li > p > a
        var ul = document.createElement('ul');

        for (var i = 0; i < replies.length; i++) {
            var reply = replies[i];

            var li = document.createElement('li');
            appendComment(li, reply);

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
        xhr.open("GET", url, true);
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
    var chooseWord = function (count) {
        if (count == 1) {
            return 'View reply';
        }
        return 'View ' + count + ' replies';
    };

    /*
     * Create reply text according to number of replies. 0 replies is just a
     * text, more than 0 will be a link.
     */
    var createReplyText = function (thread) {
        var replyText = document.createTextNode(chooseWord(thread.repliesCount));
        var url = baseUrl + '/api/thread/' + thread.id + '/comments';

        var a = document.createElement('a');
        a.setAttribute('class', 'jombelajarjava-reply-link');
        a.setAttribute('href', url);
        a.setAttribute('data-replies-loaded', 'false');
        a.addEventListener('click', loadReplies);
        a.appendChild(replyText);

        var p = document.createElement('p');
        p.appendChild(a);

        return p;
    };

    /*
     * Show threads by appending ul element into comment box.
     */
    var showThreads = function (threads) {
        var ul = document.createElement('ul');

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            var li = document.createElement('li');
            appendComment(li, thread);

            if (thread.repliesCount > 0) {
                var replyText = createReplyText(thread);
                li.appendChild(replyText);
            }

            ul.appendChild(li);
        }

        commentbox.appendChild(ul);
    };

    /*
     * Request threads from server.
     */
    var requestThreads = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8080/api/threads", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                showThreads(response.data);
            }
        };
        xhr.send();
    };

    requestThreads();
})();
