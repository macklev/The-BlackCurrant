import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFeedPosts, getCommentsByPostId, createComment, getCurrentUser } from '../apiService';

function Feed() {
  const user = getCurrentUser();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeed = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      setLoading(true);

      const feedPosts = await getFeedPosts(user.user_id);

      const postsWithComments = await Promise.all(
        feedPosts.map(async (post) => {
          try {
            const comments = await getCommentsByPostId(post.post_id);
            return { ...post, comments: comments || [] };
          } catch {
            return { ...post, comments: [] };
          }
        })
      );

      setPosts(postsWithComments);
      setError(null);
    } catch (err) {
      console.error('Error loading feed:', err);
      setError('Could not load feed.');
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  async function handleComment(postId, commentText) {
    if (!user?.user_id) return;
    if (!commentText.trim()) return;

    try {
      await createComment(user.user_id, postId, commentText);
      await loadFeed();
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Could not post comment.');
    }
  }

  function getProfileImage(profilePicture) {
    if (profilePicture && profilePicture.trim() !== '') {
      return profilePicture;
    }
    return 'Images/default-profile.png';
  }

  if (loading) return <main className="page-container"><h1>Your Feed</h1><p>Loading...</p></main>;

  return (
    <main className="page-container">
      <h1>Your Feed</h1>

      {error && <p className="error-message">{error}</p>}

      <section className="feed-posts">
        {posts.length === 0 ? (
          <p className="empty-feed">No posts yet. Add friends or create your own post.</p>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.post_id} 
              post={post} 
              onComment={handleComment}
              getProfileImage={getProfileImage}
            />
          ))
        )}
      </section>
    </main>
  );
}

function PostCard({ post, onComment, getProfileImage }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');

  const date = post.date_created ? new Date(post.date_created).toLocaleString() : '';
  const imageSrc = getProfileImage(post.profile_picture);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    onComment(post.post_id, commentText);
    setCommentText('');
    setShowCommentForm(false);
  };

  return (
    <article className="post-card">
      <header className="post-header">
        <Link to={`/profile/${post.user_id}`} className="profile-link">
          <img 
            src={imageSrc}
            alt={`${post.handle}'s profile picture`}
            className="post-profile-picture"
          />
        </Link>

        <div className="post-author-info">
          <Link to={`/profile/${post.user_id}`} className="post-author-name">
            {post.first_name} {post.last_name}
          </Link>
          <Link to={`/profile/${post.user_id}`} className="post-author-handle">
            @{post.handle}
          </Link>
          <small className="post-date">{date}</small>
        </div>
      </header>

      <p className="post-content">{post.post_content}</p>

      {post.media && post.media.length > 0 && (
        <div className="post-media">
          {post.media.map((media, index) => (
            <div key={index} className="media-item">
              {media.fileType === 'image' ? (
                <img src={media.filePath} alt={media.fileName} className="post-image" />
              ) : (
                <video className="post-video" controls>
                  <source src={media.filePath} type={media.mimeType} />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      <section className="comments-section">
        <h4>Comments</h4>

        <section className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentCard 
                key={comment.comment_id} 
                comment={comment} 
                getProfileImage={getProfileImage}
              />
            ))
          ) : (
            <p className="no-comments">No comments yet.</p>
          )}
        </section>

        {showCommentForm ? (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              maxLength="280"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              autoFocus
            />
            <button type="submit">Comment</button>
            <button type="button" onClick={() => setShowCommentForm(false)}>Cancel</button>
          </form>
        ) : (
          <button onClick={() => setShowCommentForm(true)} className="add-comment-btn">
            Add Comment
          </button>
        )}
      </section>
    </article>
  );
}

function CommentCard({ comment, getProfileImage }) {
  const date = comment.date_created ? new Date(comment.date_created).toLocaleString() : '';
  const imageSrc = getProfileImage(comment.profile_picture);

  return (
    <div className="comment-card">
      <Link to={`/profile/${comment.user_id}`} className="profile-link">
        <img 
          src={imageSrc}
          alt={`${comment.handle}'s profile picture`}
          className="comment-profile-picture"
        />
      </Link>

      <div className="comment-body">
        <div className="comment-meta">
          <Link to={`/profile/${comment.user_id}`} className="comment-author">
            {comment.first_name} {comment.last_name}
          </Link>
          <small className="comment-handle">@{comment.handle}</small>
          <small className="comment-date">{date}</small>
        </div>
        <p>{comment.comment_content}</p>
      </div>
    </div>
  );
}

export default Feed;
