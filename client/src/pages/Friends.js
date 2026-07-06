import React, { useEffect, useState, useCallback } from 'react';
import {
  getFriends,
  addFriend,
  removeFriend,
  searchUsers,
  getCurrentUser
} from '../apiService';

function Friends() {
  const user = getCurrentUser();

  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadFriends = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      setLoading(true);

      const userFriends = await getFriends(user.user_id);
      setFriends(userFriends || []);
      setError('');
    } catch (err) {
      console.error('Error loading friends:', err);
      setError('Could not load friends.');
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  // Guard loading once (single source of truth)
  if (loading) {
    return (
      <main className="page-container">
        <h1>Friends</h1>
        <p>Loading...</p>
      </main>
    );
  }

  async function handleSearch(e) {
    e.preventDefault();

    const handle = searchInput.trim();

    if (!handle) {
      setError('Enter a handle to search.');
      return;
    }

    try {
      const results = await searchUsers(handle);
      setSearchResults(results || []);
      setError('');
    } catch (err) {
      console.error('Error searching users:', err);
      setError(err.message || 'Could not search users.');
    }
  }

  async function handleAddFriend(friendId) {
    if (!user?.user_id) return;

    try {
      await addFriend(user.user_id, friendId);

      setError('');
      setSearchInput('');
      setSearchResults([]);

      await loadFriends();
    } catch (err) {
      console.error('Error adding friend:', err);
      setError(err.message || 'Could not add friend.');
    }
  }

  async function handleRemoveFriend(friendId) {
    if (!user?.user_id) return;

    try {
      await removeFriend(user.user_id, friendId);

      setError('');
      await loadFriends();
    } catch (err) {
      console.error('Error removing friend:', err);
      setError(err.message || 'Could not remove friend.');
    }
  }

  return (
    <main className="page-container">
      <h1>Friends</h1>

      <section className="friend-search-section">
        <h2>Find Friends</h2>

        <form id="friend-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            id="friend-search-input"
            placeholder="Search by handle"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>

        {error && (
          <p id="friends-message" className="error-message">
            {error}
          </p>
        )}

        {searchResults.length > 0 && (
          <section id="friend-search-results">
            <h3>Search Results</h3>

            {searchResults.map((result) => (
              <article key={result.user_id} className="friend-card">
                <div>
                  <h3>@{result.handle}</h3>
                  <p>
                    {result.first_name} {result.last_name}
                  </p>
                  <p>{result.profile_bio || ''}</p>
                </div>

                <button
                  className="add-friend-btn"
                  onClick={() => handleAddFriend(result.user_id)}
                >
                  Add Friend
                </button>
              </article>
            ))}
          </section>
        )}
      </section>

      <section className="friends-section">
        <h2>Your Friends</h2>

        <section id="friends-list">
          {friends.length === 0 ? (
            <p>You have not added any friends yet.</p>
          ) : (
            friends.map((friend) => (
              <article key={friend.user_id} className="friend-card">
                <div>
                  <h3>@{friend.handle}</h3>
                  <p>
                    {friend.first_name} {friend.last_name}
                  </p>
                  <p>{friend.profile_bio || ''}</p>
                </div>

                <button
                  className="remove-friend-btn"
                  onClick={() => handleRemoveFriend(friend.user_id)}
                >
                  Remove Friend
                </button>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default Friends;