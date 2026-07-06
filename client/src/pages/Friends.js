import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

      setSearchInput('');
      setSearchResults([]);
      setError('');

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


  function getProfileImage(image) {
    if (image && image.trim() !== '') {
      return image;
    }

    return "/Images/default-profile.png";
  }


  if (loading) {
    return (
      <main className="page-container">
        <h1>Friends</h1>
        <p>Loading...</p>
      </main>
    );
  }


  return (
    <main className="page-container">

      <h1>Friends</h1>


      {/* SEARCH USERS */}
      <section className="friend-search-section">

        <h2>Find Friends</h2>


        <form
          id="friend-search-form"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            placeholder="Search by handle"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />


          <button type="submit">
            Search
          </button>

        </form>


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}



        {searchResults.length > 0 && (

          <section id="friend-search-results">

            <h3>Search Results</h3>


            {searchResults.map((result) => (

              <article
                key={result.user_id}
                className="friend-card"
              >


                <Link
                  to={`/profile/${result.user_id}`}
                  className="friend-profile-link"
                >

                  <img
                    src={getProfileImage(result.profile_picture)}
                    alt={`${result.handle} profile`}
                    className="friend-profile-picture"
                  />


                  <div>

                    <h3>
                      @{result.handle}
                    </h3>


                    <p>
                      {result.first_name} {result.last_name}
                    </p>


                    <p>
                      {result.profile_bio || "No bio yet."}
                    </p>

                  </div>


                </Link>


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





      {/* CURRENT FRIENDS */}
      <section className="friends-section">


        <h2>
          Your Friends
        </h2>



        {friends.length === 0 ? (

          <p>
            You have not added any friends yet.
          </p>


        ) : (


          <section id="friends-list">


            {friends.map((friend) => (

              <article
                key={friend.user_id}
                className="friend-card"
              >


                <Link
                  to={`/profile/${friend.user_id}`}
                  className="friend-profile-link"
                >


                  <img
                    src={getProfileImage(friend.profile_picture)}
                    alt={`${friend.handle} profile`}
                    className="friend-profile-picture"
                  />



                  <div>


                    <h3>
                      @{friend.handle}
                    </h3>


                    <p>
                      {friend.first_name} {friend.last_name}
                    </p>


                    <p>
                      {friend.profile_bio || "No bio yet."}
                    </p>


                  </div>


                </Link>



                <button
                  className="remove-friend-btn"
                  onClick={() => handleRemoveFriend(friend.user_id)}
                >
                  Remove Friend
                </button>



              </article>

            ))}


          </section>

        )}


      </section>


    </main>
  );
}


export default Friends;

