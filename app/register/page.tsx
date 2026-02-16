"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { firebaseSignUp, firebaseUpdateProfile } from '@/lib/firebase';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long!');
            return;
        }

        try {
            const cred = await firebaseSignUp(formData.email, formData.password);
            // set display name
            await firebaseUpdateProfile({ displayName: formData.username });
            localStorage.setItem('loggedInUser', JSON.stringify({
                id: cred.user.uid,
                username: formData.username,
                email: cred.user.email
            }));
            alert(`Account created successfully for ${formData.username}!`);
            router.push('/');
        } catch (err: any) {
            setError(err?.message || 'Registration failed');
        }
    };

    return (
        <div className="form-container">
            <h1>Create Account</h1>
            <p className="form-subtitle">Join Community Event Planner today</p>

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
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Re-enter Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-full">Create Account</button>
            </form>

            <div className="form-link">
                Already have an account? <Link href="/">Sign in here</Link>
            </div>
        </div>
    );
}
