import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, getUserPosts } from '../apiService';

function ViewProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileAndPosts();
  }, [userId]);

  async function loadProfileAndPosts() {
    try {
      setLoading(true);
      const profileData = await getProfile(userId);
      setProfile(profileData);

      const userPosts = await getUserPosts(userId);
      setPosts(userPosts || []);
      setError('');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Could not load profile.');
    } finally {
      setLoading(false);
    }
  }

  function getProfileImage(profilePicture) {
    if (profilePicture && profilePicture.trim() !== '') {
      return profilePicture;
    }
    return 'Images/default-profile.png';
  }

  if (loading) return (
    <main className="page-container">
      <h1>Profile</h1>
      <p>Loading...</p>
    </main>
  );

  if (error) return (
    <main className="page-container">
      <h1>Profile</h1>
      <p className="error-message">{error}</p>
    </main>
  );

  return (
    <main className="page-container">
      <h1>{profile?.first_name} {profile?.last_name}</h1>

      {profile && (
        <section className="public-profile-card">
          <img 
            id="public-profile-picture" 
            src={getProfileImage(profile.profile_picture)} 
            alt="Profile picture" 
            className="public-profile-picture"
          />
          <h2 id="public-profile-name">
            {profile.first_name} {profile.last_name}
          </h2>
          <p id="public-profile-handle">@{profile.handle}</p>
          <p id="public-profile-bio">{profile.profile_bio || 'No bio yet.'}</p>
        </section>
      )}

      <h2>Posts</h2>
      <section id="public-profile-posts" className="posts-section">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <article key={post.post_id} className="post-card">
              <p className="post-content">{post.post_content}</p>
              <small className="post-date">
                {post.date_created ? new Date(post.date_created).toLocaleString() : ''}
              </small>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default ViewProfile;
