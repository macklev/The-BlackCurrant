function Navbar() {
  const currentUser = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg site-navbar navbar-dark">
      <div className="container">
        <a className="navbar-brand brand-mark" href="/index.html">
          The Black Current
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNavbar"
          aria-controls="siteNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="siteNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/feed.html">
                    Feed
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/post.html">
                    Post
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/friends.html">
                    Friends
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/profile.html">
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/viewProfile.html">
                    View Profile
                  </a>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link nav-logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/login.html">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/register.html">
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;