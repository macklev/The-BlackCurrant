import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, setCurrentUser } from '../apiService';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  if (!email.trim() || !password.trim()) {
    setMessage('Email and password are required');
    return;
  }

  setIsSubmitting(true);
  setMessage('');

  try {
    const data = await loginUser(email, password);
    setCurrentUser(data);

    setEmail('');
    setPassword('');

    navigate('/feed');
  } catch (error) {
    setMessage(
      error?.response?.data?.message ||
      error?.message ||
      'Login failed'
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section className="auth-card card-shadow" id="login">
      <div className="auth-card-header">
        <p className="eyebrow mb-1">Member access</p>
        <h2 className="section-title mb-0">Login</h2>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="login-email">
            Email address
          </label>
          <input
            className="form-control themed-input"
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <input
            className="form-control themed-input"
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className="btn themed-button w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        {message ? <p className="auth-message mb-0 mt-3">{message}</p> : null}
      </form>
    </section>
  );
}

export default LoginForm;