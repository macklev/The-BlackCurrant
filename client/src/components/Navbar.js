import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, removeCurrentUser } from '../apiService';

function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCurrentUser();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg site-navbar navbar-dark">
      <div className="container">
        <Link className="navbar-brand brand-mark" to="/">
          The Black Currant
        </Link>
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
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/feed">
                    Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/post">
                    Post
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/friends">
                    Friends
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
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
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
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