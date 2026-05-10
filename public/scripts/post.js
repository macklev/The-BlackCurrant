const form = document.getElementById("post-form");
const postText = document.getElementById("post-text");
const postMessage = document.getElementById("post-message");
const postFeed = document.querySelector(".post-feed");

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

async function loadPosts() {
    try {
        const response = await fetch(`/post/getPostsByUserId/${user.user_id}`);

        if (!response.ok) {
            throw new Error("Could not load posts.");
        }

        const posts = await response.json();

        displayPosts(posts);
    } catch (error) {
        console.error(error);
        postFeed.innerHTML = `<p class="empty-feed">Could not load posts.</p>`;
    }
}

function displayPosts(posts) {
    postFeed.innerHTML = "";

    if (!posts || posts.length === 0) {
        postFeed.innerHTML = `<p class="empty-feed">No posts yet. Create your first post!</p>`;
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement("article");
        postCard.classList.add("post-card");

        const content = document.createElement("p");
        content.textContent = post.post_content;

        const date = document.createElement("small");

        if (post.date_created) {
            date.textContent = new Date(post.date_created).toLocaleString();
        }

        postCard.appendChild(content);
        postCard.appendChild(date);

        postFeed.appendChild(postCard);
    });
}

async function createPost(event) {
    event.preventDefault();

    const post_content = postText.value.trim();

    if (!post_content) {
        postMessage.textContent = "Please write something before posting.";
        return;
    }

    try {
        const response = await fetch("/post/createPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.user_id,
                post_content: post_content,
            }),
        });

        if (!response.ok) {
            throw new Error("Could not create post.");
        }

        postText.value = "";
        postMessage.textContent = "Post created successfully!";

        loadPosts();
    } catch (error) {
        console.error(error);
        postMessage.textContent = "Post could not be created.";
    }
}

form.addEventListener("submit", createPost);
loadPosts();