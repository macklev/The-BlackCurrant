const user = JSON.parse(localStorage.getItem("user"));

const searchForm = document.getElementById("friend-search-form");
const searchInput = document.getElementById("friend-search-input");
const searchResults = document.getElementById("friend-search-results");
const friendsList = document.getElementById("friends-list");
const friendsMessage = document.getElementById("friends-message");

if (!user) {
    window.location.href = "login.html";
}

async function loadFriends() {
    try {
        const response = await fetch(`/friend/getFriends/${user.user_id}`);
        const friends = await response.json();

        if (!response.ok) {
            throw new Error(friends.message || "Could not load friends.");
        }

        displayFriends(friends);
    } catch (error) {
        console.error(error);
        friendsMessage.textContent = "Could not load friends.";
    }
}

function displayFriends(friends) {
    friendsList.innerHTML = "";

    if (!friends || friends.length === 0) {
        friendsList.innerHTML = `<p>You have not added any friends yet.</p>`;
        return;
    }

    friends.forEach(friend => {
        const card = document.createElement("article");
        card.classList.add("friend-card");

        card.innerHTML = `
            <div>
                <h3>@${friend.handle}</h3>
                <p>${friend.first_name} ${friend.last_name}</p>
                <p>${friend.profile_bio || ""}</p>
            </div>

            <button class="remove-friend-btn" data-id="${friend.user_id}">
                Remove Friend
            </button>
        `;

        friendsList.appendChild(card);
    });

    const removeButtons = document.querySelectorAll(".remove-friend-btn");

    removeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const friendId = this.dataset.id;
            removeFriend(friendId);
        });
    });
}

async function addFriend(friendId) {
    try {
        const response = await fetch("/friend/addFriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.user_id,
                friend_id: friendId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not add friend.");
        }

        friendsMessage.textContent = "Friend added!";
        searchResults.innerHTML = "";
        searchInput.value = "";

        loadFriends();
    } catch (error) {
        console.error(error);
        friendsMessage.textContent = error.message;
    }
}

async function removeFriend(friendId) {
    try {
        const response = await fetch(`/friend/removeFriend/${user.user_id}/${friendId}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not remove friend.");
        }

        friendsMessage.textContent = "Friend removed.";
        loadFriends();
    } catch (error) {
        console.error(error);
        friendsMessage.textContent = error.message;
    }
}

/*
    This function searches users by handle.
    You need a backend route for this:
    GET /user/search/:handle
*/
async function searchUsers(event) {
    event.preventDefault();

    const handle = searchInput.value.trim();

    if (!handle) {
        friendsMessage.textContent = "Enter a handle to search.";
        return;
    }

    try {
        const response = await fetch(`/user/search/${handle}`);
        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.message || "Could not search users.");
        }

        displaySearchResults(users);
    } catch (error) {
        console.error(error);
        friendsMessage.textContent = error.message;
    }
}

function displaySearchResults(users) {
    searchResults.innerHTML = "";

    if (!users || users.length === 0) {
        searchResults.innerHTML = `<p>No users found.</p>`;
        return;
    }

    users.forEach(foundUser => {
        if (Number(foundUser.user_id) === Number(user.user_id)) {
            return;
        }

        const card = document.createElement("article");
        card.classList.add("friend-card");

        card.innerHTML = `
            <div>
                <h3>@${foundUser.handle}</h3>
                <p>${foundUser.first_name} ${foundUser.last_name}</p>
            </div>

            <button class="add-friend-btn" data-id="${foundUser.user_id}">
                Add Friend
            </button>
        `;

        searchResults.appendChild(card);
    });

    const addButtons = document.querySelectorAll(".add-friend-btn");

    addButtons.forEach(button => {
        button.addEventListener("click", function () {
            const friendId = this.dataset.id;
            addFriend(friendId);
        });
    });
}

searchForm.addEventListener("submit", searchUsers);
loadFriends();