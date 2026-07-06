import React, { useEffect, useState, useCallback } from 'react';
import { getProfile, saveProfile, getCurrentUser } from '../apiService';

function Profile() {
  const user = getCurrentUser();
  const userId = user?.user_id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    profile_picture: '',
    profile_bio: ''
  });

  const loadProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const data = await getProfile(userId);

      setProfile(data);
      setFormData({
        profile_picture: data?.profile_picture || '',
        profile_bio: data?.profile_bio || ''
      });

      setError('');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Could not load profile.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccessMessage('');
    setError('');

    if (!userId) {
      setError('You must be logged in.');
      return;
    }

    try {
      const updated = await saveProfile(userId, formData);

      setProfile(updated);
      setSuccessMessage('Profile saved!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Could not save profile.');
    }
  }

  function getProfileImage(profilePicture) {
    if (profilePicture && profilePicture.trim() !== '') {
      return profilePicture;
    }
    return 'Images/default-profile.png';
  }

  if (loading)
    return (
      <main className="page-container">
        <h1>My Profile</h1>
        <p>Loading...</p>
      </main>
    );

  return (
    <main className="page-container">
      <h1>My Profile</h1>

      {profile && (
        <>
          <section className="profile-card">
            <img
              id="profile-preview"
              src={getProfileImage(profile.profile_picture)}
              alt={`${profile?.first_name || 'user'} profile`}
              className="profile-picture"
            />

            <h2>
              {profile.first_name} {profile.last_name}
            </h2>

            <p id="profile-handle">@{profile.handle}</p>
            <p id="profile-bio-display">
              {profile.profile_bio || 'No bio yet.'}
            </p>
          </section>

          <section className="profile-form-section">
            <h2>Edit Profile</h2>

            <form id="profile-form" onSubmit={handleSubmit}>
              <label htmlFor="profile-picture">Profile Picture URL</label>
              <input
                type="text"
                id="profile-picture"
                placeholder="Images/default_profile.png"
                value={formData.profile_picture}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile_picture: e.target.value
                  })
                }
              />

              <label htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                maxLength="255"
                placeholder="Write a short bio..."
                value={formData.profile_bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile_bio: e.target.value
                  })
                }
              />

              <button type="submit">Save Profile</button>
            </form>

            {error && (
              <p id="profile-message" className="error-message">
                {error}
              </p>
            )}

            {successMessage && (
              <p id="profile-message" className="success-message">
                {successMessage}
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Profile;