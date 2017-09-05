let postsService = (() => {

    function loadAllPosts(username) {
        let endPoint = `posts?query={}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endPoint, 'kinvey');
    }

    function submitPost(author, title, url, imageUrl, description) {
        let commentData = {
            author,
            title,
            url,
            imageUrl,
            description
        };
        return requester.post('appdata', 'posts', 'kinvey', commentData)
    }

    function editPost(postId) {
        return requester.put()
    }

    function loadSelectedPost(postId) {
        let endPoint = `posts/${postId}`;
        return requester.get('appdata', endPoint, 'kinvey');
    }

    function loadPostComments(postId) {
        let endPoint = `comments?query={"postId":"${postId}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endPoint, 'kinvey');
    }

    function sendComment(author, content, postId) {
        let commentData = {
            author,
            content,
            postId
        };
        return requester.post('appdata', 'comments', 'kinvey', commentData)
    }

    return {
        loadAllPosts,
        loadSelectedPost,
        loadPostComments,
        sendComment,
        submitPost
    }
})();