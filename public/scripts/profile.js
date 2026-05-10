const user = JSON.parse(localStorage.getItem("user"));

const profileForm = document.getElementById("profile-form");
const profilePictureInput = document.getElementById("profile-picture");
const profileBioInput = document.getElementById("profile-bio");
const profileMessage = document.getElementById("profile-message");

const profilePreview = document.getElementById("profile-preview");
const profileName = document.getElementById("profile-name");
const profileHandle = document.getElementById("profile-handle");
const profileBioDisplay = document.getElementById("profile-bio-display");

if (!user) {
    window.location.href = "login.html";
}

async function loadProfile() {
    try {
        const response = await fetch(`/profile/getProfile/${user.user_id}`);
        const profile = await response.json();

        if (!response.ok) {
            throw new Error(profile.message || "Could not load profile.");
        }

        displayProfile(profile);
    } catch (error) {
        console.error(error);
        profileMessage.textContent = "Could not load profile.";
    }
}

function displayProfile(profile) {
    profileName.textContent = `${profile.first_name} ${profile.last_name}`;
    profileHandle.textContent = `@${profile.handle}`;

    profileBioDisplay.textContent = profile.profile_bio || "No bio yet.";

    if (profile.profile_picture) {
    profilePreview.src = profile.profile_picture;
} else {
    profilePreview.src = "images/default_profile.png";
}

    profilePictureInput.value = profile.profile_picture || "";
    profileBioInput.value = profile.profile_bio || "";
}

async function saveProfile(event) {
    event.preventDefault();

    const profile_picture = profilePictureInput.value.trim();
    const profile_bio = profileBioInput.value.trim();

    try {
        const response = await fetch("/profile/saveProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.user_id,
                profile_picture,
                profile_bio,
            }),
        });

        const profile = await response.json();

        if (!response.ok) {
            throw new Error(profile.message || "Could not save profile.");
        }

        profileMessage.textContent = "Profile saved!";
        displayProfile(profile);
    } catch (error) {
        console.error(error);
        profileMessage.textContent = error.message;
    }
}

profileForm.addEventListener("submit", saveProfile);
loadProfile();