"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check if user is in guest mode
        const guestMode = localStorage.getItem('guestMode');
        if (guestMode === 'true') {
            alert('Please sign in to access your account');
            router.push('/');
            return;
        }

        // Check if user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            router.push('/');
            return;
        }

        setUser(JSON.parse(loggedInUser));
    }, [router]);

    const handleSignOut = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('guestMode');
        router.push('/');
    };

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '600px' }}>
                <h1>Account Details</h1>
                <p className="form-subtitle">Your profile information</p>

                <div style={{
                    backgroundColor: 'var(--secondary-color)',
                    padding: '2rem',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            marginRight: '1.5rem'
                        }}>
                            👤
                        </div>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{user.username}</h2>
                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>Member</p>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Username</label>
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)'
                        }}>
                            {user.username}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Email</label>
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)'
                        }}>
                            {user.email}
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>User ID</label>
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace'
                        }}>
                            #{user.id}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="btn btn-danger btn-full"
                    style={{ fontSize: '1rem' }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
