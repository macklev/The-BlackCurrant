const feedContainer = document.querySelector(".feed-posts");
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

function getProfileImage(profilePicture) {
    if (profilePicture && profilePicture.trim() !== "") {
        return profilePicture;
    }

    return "images/default-profile.png";
}

function profileLink(userId) {
    return `viewProfile.html?user_id=${userId}`;
}

async function loadFeed() {
    try {
        const response = await fetch(`/post/feed/${user.user_id}`);
        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.message || "Could not load feed.");
        }

        displayFeed(posts);
    } catch (error) {
        console.error(error);
        feedContainer.innerHTML = `<p>Could not load feed.</p>`;
    }
}

function displayFeed(posts) {
    feedContainer.innerHTML = "";

    if (!posts || posts.length === 0) {
        feedContainer.innerHTML = `
            <p class="empty-feed">No posts yet. Add friends or create your own post.</p>
        `;
        return;
    }

    posts.forEach(post => {
        const card = document.createElement("article");
        card.classList.add("post-card");

        const date = post.date_created
            ? new Date(post.date_created).toLocaleString()
            : "";

        const imageSrc = getProfileImage(post.profile_picture);

        card.innerHTML = `
            <header class="post-header">
                <a href="${profileLink(post.user_id)}" class="profile-link">
                    <img 
                        src="${imageSrc}" 
                        alt="${post.handle}'s profile picture" 
                        class="post-profile-picture"
                    >
                </a>

                <div class="post-author-info">
                    <a href="${profileLink(post.user_id)}" class="post-author-name">
                        ${post.first_name} ${post.last_name}
                    </a>
                    <a href="${profileLink(post.user_id)}" class="post-author-handle">
                        @${post.handle}
                    </a>
                    <small class="post-date">${date}</small>
                </div>
            </header>

            <p class="post-content">${post.post_content}</p>

            <section class="comments-section">
                <h4>Comments</h4>

                <section class="comments-list" id="comments-${post.post_id}">
                    <p>Loading comments...</p>
                </section>

                <form class="comment-form" data-post-id="${post.post_id}">
                    <input
                        type="text"
                        class="comment-input"
                        placeholder="Write a comment..."
                        maxlength="280"
                        required
                    >
                    <button type="submit">Comment</button>
                </form>
            </section>
        `;

        feedContainer.appendChild(card);

        loadComments(post.post_id);
    });

    const commentForms = document.querySelectorAll(".comment-form");

    commentForms.forEach(form => {
        form.addEventListener("submit", createComment);
    });
}

async function loadComments(postId) {
    const commentsContainer = document.getElementById(`comments-${postId}`);

    try {
        const response = await fetch(`/comment/getCommentsByPostId/${postId}`);
        const comments = await response.json();

        if (!response.ok) {
            throw new Error(comments.message || "Could not load comments.");
        }

        displayComments(postId, comments);
    } catch (error) {
        console.error(error);
        commentsContainer.innerHTML = `<p>Could not load comments.</p>`;
    }
}

function displayComments(postId, comments) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    commentsContainer.innerHTML = "";

    if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = `<p class="no-comments">No comments yet.</p>`;
        return;
    }

    comments.forEach(comment => {
        const commentCard = document.createElement("div");
        commentCard.classList.add("comment-card");

        const date = comment.date_created
            ? new Date(comment.date_created).toLocaleString()
            : "";

        const imageSrc = getProfileImage(comment.profile_picture);

        commentCard.innerHTML = `
            <a href="${profileLink(comment.user_id)}" class="profile-link">
                <img 
                    src="${imageSrc}" 
                    alt="${comment.handle}'s profile picture" 
                    class="comment-profile-picture"
                >
            </a>

            <div class="comment-body">
                <div class="comment-meta">
                    <a href="${profileLink(comment.user_id)}" class="comment-author">
                        @${comment.handle}
                    </a>
                    <small>${date}</small>
                </div>

                <p>${comment.comment_content}</p>
            </div>
        `;

        commentsContainer.appendChild(commentCard);
    });
}

async function createComment(event) {
    event.preventDefault();

    const form = event.target;
    const postId = form.dataset.postId;
    const input = form.querySelector(".comment-input");
    const comment_content = input.value.trim();

    if (!comment_content) {
        return;
    }

    try {
        const response = await fetch("/comment/createComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: user.user_id,
                comment_content: comment_content,
            }),
        });

        const comments = await response.json();

        if (!response.ok) {
            throw new Error(comments.message || "Could not create comment.");
        }

        input.value = "";
        displayComments(postId, comments);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function getProfileImage(profilePicture) {
    if (profilePicture && profilePicture.trim() !== "") {
        return profilePicture;
    }

    return "images/default_profile.png";
}

loadFeed();