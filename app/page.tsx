"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockUsers } from '@/lib/mockData';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Find user in mock data
    const user = mockUsers.find(
      u => u.username === formData.username &&
        u.email === formData.email &&
        u.password === formData.password
    );

    if (user) {
      // Clear guest mode if it was set
      localStorage.removeItem('guestMode');
      // Store user in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
      }));

      // Redirect to events page
      router.push('/events');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1>Welcome Back</h1>
      <p className="form-subtitle">Sign in to continue to Community Event Planner</p>

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">Sign In</button>
      </form>

      <div className="form-link">
        Don't have an account? <Link href="/register">Register here</Link>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem('guestMode', 'true');
            router.push('/events');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Continue without signing in
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f8ff',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#555'
      }}>
        <strong>Demo Credentials:</strong><br />
        Username: demoUser<br />
        Email: demo@example.com<br />
        Password: password123
      </div>
    </div>
  );
}
