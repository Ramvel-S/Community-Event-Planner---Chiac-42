"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const guestMode = localStorage.getItem('guestMode');
                setIsGuest(guestMode === 'true');

                const loggedInUser = localStorage.getItem('loggedInUser');
                setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
            } catch (e) {
                setIsGuest(false);
                setUser(null);
            }
        };

        // Run on mount and whenever the pathname changes (route navigation)
        checkAuth();

        // Listen for cross-tab/localStorage changes
        const onStorage = () => checkAuth();
        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('guestMode');
        setUser(null);
        setIsGuest(false);
        router.push('/');
    };

    const handleSignIn = () => {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
        // attempt to pick up any existing loggedInUser immediately
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) setUser(JSON.parse(loggedInUser));
        router.push('/');
    };

    const handleCreateEventClick = (e) => {
        if (isGuest) {
            e.preventDefault();
            alert('Please sign in to create events. You need an account to create events.');
            return;
        }
        router.push('/create-event');
    };

    const handleAccountClick = () => {
        if (isGuest) {
            alert('No account created. Please sign in or register to access account features.');
        } else {
            router.push('/account');
        }
    };

    // Check if we're on the events page
    const isEventsPage = pathname === '/events';

    // Hide navbar on login and register pages
    const shouldHideNavbar = pathname === '/' || pathname === '/register';

    if (shouldHideNavbar) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link href="/events" className="navbar-brand">
                    Community Event Planner
                </Link>
                <div className="navbar-right">
                    {isEventsPage && (
                        <>
                            <button
                                onClick={handleCreateEventClick}
                                className="btn btn-primary"
                            >
                                Create Event
                            </button>

                            {user && (
                                <div
                                    className="navbar-user"
                                    onClick={handleAccountClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="navbar-user-icon">👤</span>
                                    <span>{user.username}</span>
                                </div>
                            )}
                        </>
                    )}

                    {!isEventsPage && (user && !isGuest ? (
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            Logout
                        </button>
                    ) : (
                        <button onClick={handleSignIn} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            Sign In
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
