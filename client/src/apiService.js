const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("BASE URL:", process.env.REACT_APP_API_BASE_URL);

if (!API_BASE_URL) {
  throw new Error("REACT_APP_API_BASE_URL is missing from .env");
}

export async function fetchAPI(route, data = {}, method = 'GET') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${route}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

//user functions 
export async function registerUser(userData) {
  return fetchAPI('/user/register', userData, 'POST');
}

export async function loginUser(email, password) {
  return fetchAPI('/user/login', { email, password }, 'POST');
}

export async function searchUsers(handle) {
  return fetchAPI(`/user/search/${handle}`);
}

//profile functions
export async function getProfile(userId) {
  return fetchAPI(`/profile/getProfile/${userId}`);
}

export async function saveProfile(userId, formData) {
  const response = await fetch(
    `${API_BASE_URL}/profile/saveProfile`,
    {
      method: "POST",
      body: formData
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Profile update failed");
  }

  return result;
}

// Post functions
export async function getFeedPosts(userId) {
  return fetchAPI(`/post/feed/${userId}`);
}

export async function getUserPosts(userId) {
  return fetchAPI(`/post/getPostsByUserId/${userId}`);
}

export async function createPost(userId, postContent, files = []) {
  // If files are included, use FormData
  if (files && files.length > 0) {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('post_content', postContent);
    
    // Append files
    files.forEach(file => {
      formData.append('media', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/post/createPost`, {
        method: 'POST',
        body: formData
        // Note: Don't set Content-Type header; browser will set it with boundary
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `API Error: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  } else {
    // No files, use standard JSON request
    return fetchAPI('/post/createPost', { user_id: userId, post_content: postContent }, 'POST');
  }
}

export async function updatePost(postId, postContent) {
  return fetchAPI(
    `/post/updatePost/${postId}`,
    { post_content: postContent },
    'PUT'
  );
}

export async function deletePost(postId, userId) {
  return fetchAPI(
    `/post/deletePost/${postId}/${userId}`,
    {},
    'DELETE'
  );
}

// Comment functions
export async function getCommentsByPostId(postId) {
  return fetchAPI(`/comment/getCommentsByPostId/${postId}`);
}

export async function createComment(userId, postId, commentContent) {
  return fetchAPI('/comment/createComment', { user_id: userId, post_id: postId, comment_content: commentContent }, 'POST');
}

// Friend functions
export async function getFriends(userId) {
  return fetchAPI(`/friend/getFriends/${userId}`);
}

export async function addFriend(userId, friendId) {
  return fetchAPI('/friend/addFriend', { user_id: userId, friend_id: friendId }, 'POST');
}

export async function removeFriend(userId, friendId) {
  return fetchAPI(`/friend/removeFriend/${userId}/${friendId}`, {}, 'DELETE');
}

// Auth functions
export function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function removeCurrentUser() {
  localStorage.removeItem('user');
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}
