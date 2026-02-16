"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { firebaseSignIn } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const cred = await firebaseSignIn(formData.email, formData.password);
      const user = cred.user;
      localStorage.removeItem('guestMode');
      localStorage.setItem('loggedInUser', JSON.stringify({
        id: user.uid,
        username: user.displayName || formData.username,
        email: user.email
      }));
      router.push('/events');
    } catch (err: any) {
      setError(err?.message || 'Sign in failed');
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

      
    </div>
  );
}
