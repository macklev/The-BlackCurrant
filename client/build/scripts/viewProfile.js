const params = new URLSearchParams(window.location.search);
const profileUserId = params.get("user_id");

const profilePicture = document.getElementById("public-profile-picture");
const profileName = document.getElementById("public-profile-name");
const profileHandle = document.getElementById("public-profile-handle");
const profileBio = document.getElementById("public-profile-bio");
const profilePosts = document.getElementById("public-profile-posts");

if (!profileUserId) {
    profileName.textContent = "Profile not found.";
}

function getProfileImage(profilePictureValue) {
    if (profilePictureValue && profilePictureValue.trim() !== "") {
        return profilePictureValue;
    }

    return "images/default_profile.png";
}

async function loadPublicProfile() {
    try {
        const response = await fetch(`/profile/getProfile/${profileUserId}`);
        const profile = await response.json();

        if (!response.ok) {
            throw new Error(profile.message || "Could not load profile.");
        }

        displayProfile(profile);
        loadUserPosts(profileUserId);
    } catch (error) {
        console.error(error);
        profileName.textContent = "Could not load profile.";
    }
}

function displayProfile(profile) {
    profilePicture.src = getProfileImage(profile.profile_picture);
    profileName.textContent = `${profile.first_name} ${profile.last_name}`;
    profileHandle.textContent = `@${profile.handle}`;
    profileBio.textContent = profile.profile_bio || "No bio yet.";
}

async function loadUserPosts(userId) {
    try {
        const response = await fetch(`/post/getPostsByUserId/${userId}`);
        const posts = await response.json();

        if (!response.ok) {
            throw new Error(posts.message || "Could not load posts.");
        }

        displayPosts(posts);
    } catch (error) {
        console.error(error);
        profilePosts.innerHTML = `<p>Could not load posts.</p>`;
    }
}

function displayPosts(posts) {
    profilePosts.innerHTML = "";

    if (!posts || posts.length === 0) {
        profilePosts.innerHTML = `<p>No posts yet.</p>`;
        return;
    }

    posts.forEach(post => {
        const card = document.createElement("article");
        card.classList.add("post-card");

        const date = post.date_created
            ? new Date(post.date_created).toLocaleString()
            : "";

        card.innerHTML = `
            <p class="post-content">${post.post_content}</p>
            <small>${date}</small>
        `;

        profilePosts.appendChild(card);
    });
}

loadPublicProfile();