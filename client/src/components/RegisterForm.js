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

function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          handle: username,
          email,
          password,
        }),
      });

      const data = await readResponseBody(response);

      if (!response.ok) {
        const fallbackMessage = data.message || 'Registration failed';
        throw new Error(
          fallbackMessage.startsWith('Proxy error')
            ? 'Backend is not running on port 3500 or the proxy target is unavailable.'
            : fallbackMessage
        );
      }

      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = '/feed.html';
      setFirstName('');
      setLastName('');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card card-shadow" id="register">
      <div className="auth-card-header">
        <p className="eyebrow mb-1">Join the community</p>
        <h2 className="section-title mb-0">Register</h2>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="register-first-name">
            First name
          </label>
          <input
            className="form-control themed-input"
            id="register-first-name"
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="register-last-name">
            Last name
          </label>
          <input
            className="form-control themed-input"
            id="register-last-name"
            type="text"
            placeholder="Your last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="register-name">
            Handle
          </label>
          <input
            className="form-control themed-input"
            id="register-name"
            type="text"
            placeholder="Choose a handle"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="register-email">
            Email address
          </label>
          <input
            className="form-control themed-input"
            id="register-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="register-password">
            Password
          </label>
          <input
            className="form-control themed-input"
            id="register-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className="btn themed-button w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        {message ? <p className="auth-message mb-0 mt-3">{message}</p> : null}
      </form>
    </section>
  );
}

export default RegisterForm;