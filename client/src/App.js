import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Post from './pages/Post';
import ViewProfile from './pages/ViewProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { isLoggedIn } from './apiService';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn() ? <Navigate to="/feed" replace /> : <HomePage />} 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/feed" 
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:userId" 
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/friends" 
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post" 
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="app-shell">
      <main className="container py-4 py-lg-5">
        <section className="hero card-shadow">
          <p className="eyebrow mb-2">The Black Currant</p>
          <h1 className="display-title mb-3">Welcome back to the BlackCurrant</h1>
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

function LoginPage() {
  return (
    <div className="app-shell">
      <main className="container py-4 py-lg-5">
        <h1 className="display-title mb-3">Login</h1>
        <LoginForm />
      </main>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="app-shell">
      <main className="container py-4 py-lg-5">
        <h1 className="display-title mb-3">Register</h1>
        <RegisterForm />
      </main>
    </div>
  );
}

export default App;
