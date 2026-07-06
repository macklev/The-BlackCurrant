import React, { useEffect, useState, useCallback } from 'react';
import { createPost, getUserPosts, getCurrentUser, updatePost, deletePost } from '../apiService';

function Post() {
  const user = getCurrentUser();
  const userId = user?.user_id;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editingText, setEditingText] = useState('');

  const loadPosts = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const userPosts = await getUserPosts(userId);
      setPosts(userPosts || []);
      setError('');
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Could not load posts.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

   useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setError('Maximum 5 files allowed per post.');
      return;
    }

    setSelectedFiles(files);

    // Create previews
    const previews = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            src: reader.result
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(setFilePreviews);
  }

  function removeFile(index) {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setFilePreviews(filePreviews.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  setSuccessMessage('');

  if (!userId) {
    setError('You must be logged in.');
    return;
  }

  if (!postText.trim() && selectedFiles.length === 0) {
    setError('Please write something or add media before posting.');
    return;
  }

  try {
    await createPost(userId, postText, selectedFiles);

    setPostText('');
    setSelectedFiles([]);
    setFilePreviews([]);

    setSuccessMessage('Post created successfully!');

    await loadPosts();
  } catch (err) {
    console.error('Error creating post:', err);
    setError('Post could not be created.');
  }
}

async function handleDelete(postId) {
  try {
    await deletePost(postId);
    await loadPosts();
  } catch(err) {
    console.error(err);
    setError("Could not delete post.");
  }
}


async function handleEdit(postId) {
  try {
    await updatePost(postId, editingText);

    setEditingPost(null);
    setEditingText('');

    await loadPosts();

  } catch(err) {
    console.error(err);
    setError("Could not edit post.");
  }
}

  if (loading) return (
    <main className="page-container">
      <h1>Make a Post</h1>
      <p>Loading...</p>
    </main>
  );

  return (
    <main className="page-container">
      <h1>Make a Post</h1>

      <form className="make-post" id="post-form" onSubmit={handleSubmit}>
        <textarea 
          id="post-text" 
          name="post" 
          placeholder="Write your post here." 
          rows="4"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        
        <div className="file-upload-section">
          <label htmlFor="file-input" className="file-input-label">
            📷 Add Images or Videos (up to 5 files)
          </label>
          <input
            type="file"
            id="file-input"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {filePreviews.length > 0 && (
          <div className="file-previews">
            <p className="preview-title">Selected files ({filePreviews.length}):</p>
            <div className="preview-grid">
              {filePreviews.map((preview, index) => (
                <div key={index} className="preview-item">
                  {preview.type === 'image' ? (
                    <img src={preview.src} alt={preview.name} className="preview-image" />
                  ) : (
                    <video className="preview-video" controls>
                      <source src={preview.src} />
                    </video>
                  )}
                  <p className="preview-name">{preview.name}</p>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <br />
        <input type="submit" value="Post" id="button" />
        {error && <p id="post-message" className="error-message" aria-live="polite">{error}</p>}
        {successMessage && <p id="post-message" className="success-message" aria-live="polite">{successMessage}</p>}
      </form>

      <section className="post-feed">
        {posts.length === 0 ? (
          <p className="empty-feed">No posts yet. Create your first post!</p>
        ) : (
          posts.map((post) => (
  <article key={post.post_id} className="post-card">

    {editingPost === post.post_id ? (
      <div className="edit-post">

        <textarea
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
        />

        <button
          onClick={() => handleEdit(post.post_id)}
        >
          Save
        </button>

        <button
          onClick={() => {
            setEditingPost(null);
            setEditingText('');
          }}
        >
          Cancel
        </button>

      </div>

    ) : (

      <p className="post-content">
        {post.post_content}
      </p>

    )}


    <div className="post-actions">

      <button
        onClick={() => {
          setEditingPost(post.post_id);
          setEditingText(post.post_content);
        }}
      >
        Edit
      </button>


      <button
        onClick={() => {
          if(window.confirm("Delete this post?")) {
            handleDelete(post.post_id);
          }
        }}
      >
        Delete
      </button>

    </div>
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

export default Post;
