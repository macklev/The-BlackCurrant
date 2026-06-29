import './App.css';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  useEffect(() => {
    const currentUser = localStorage.getItem('user');

    if (currentUser) {
      window.location.replace('/feed.html');
    }
  }, []);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container py-4 py-lg-5">
        <section className="hero card-shadow">
          <p className="eyebrow mb-2">The Black Current</p>
          <h1 className="display-title mb-3">Welcome back to the BlackCurrent</h1>
          <p className="hero-copy mb-0">
            An alternative social media site for those who are just a <em>little</em> quirky.
          </p>
        </section>

        <div className="row g-4 align-items-start mt-1 mt-lg-3">
          <div className="col-12 col-lg-6">
            <LoginForm />
          </div>
          <div className="col-12 col-lg-6">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
