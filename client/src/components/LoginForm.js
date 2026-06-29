import { useState } from 'react';

async function readResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await readResponseBody(response);

      if (!response.ok) {
        const fallbackMessage = data.message || 'Login failed';
        throw new Error(
          fallbackMessage.startsWith('Proxy error')
            ? 'Backend is not running on port 3500 or the proxy target is unavailable.'
            : fallbackMessage
        );
      }

      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = '/feed.html';
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.message);
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