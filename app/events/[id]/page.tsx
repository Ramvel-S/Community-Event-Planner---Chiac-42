"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { subscribeEvents, toggleRSVP, deleteEvent } from '@/lib/eventService';

export default function EventDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const docId = Array.isArray(params?.id) ? params.id[0] : String(params?.id);

    const [event, setEvent] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [hasRSVPd, setHasRSVPd] = useState(false);

    useEffect(() => {
        let unsub: any = null;
        (async () => {
            // Subscribe to the events collection and pull the matching event
            unsub = subscribeEvents((docs) => {
                const found = (docs || []).find((d: any) => d.id === docId);
                setEvent(found || null);

                if (!found) return;

                // Check if user is in guest mode
                const guestMode = localStorage.getItem('guestMode');
                if (guestMode === 'true') {
                    setIsGuest(true);
                    return;
                }

                // Check if user is logged in
                const loggedInUser = localStorage.getItem('loggedInUser');
                if (!loggedInUser) {
                    // Not logged in and not guest - redirect to login
                    router.push('/');
                    return;
                }

                const userData = JSON.parse(loggedInUser);
                setUser(userData);

                // Check if user is in attendees list
                const isAttending = Array.isArray(found.attendees) && found.attendees.some((a: any) => a.id === userData.id);
                setHasRSVPd(!!isAttending);
            });
        })();

        return () => unsub && unsub();
    }, [router, docId]);

    if (!event) {
        return (
            <div className="container">
                <div className="event-details">
                    <h1>Event Not Found</h1>
                    <p>The event you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    if (!user && !isGuest) {
        return null; // Will redirect
    }

    const isOwner = user && user.id === event.created_by;

    const handleRSVP = () => {
        if (!user || !event) return;
        // Toggle RSVP via Firestore. We pass uid & username.
        const currentUser = { uid: user.id, username: user.username };
        // Optimistically update UI
        setHasRSVPd(!hasRSVPd);
        toggleRSVP(event.id, currentUser).catch((err) => {
            console.error('toggleRSVP failed', err);
            // revert optimistic update on failure
            setHasRSVPd(hasRSVPd);
            alert('Failed to update RSVP. Please try again.');
        });
    }

    const handleEdit = () => {
        router.push(`/edit-event/${event.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this event?')) {
                        // call Firestore delete (only owner allowed)
                        const currentUser = { uid: user.id };
                        deleteEvent(event.id, currentUser)
                            .then(() => {
                                alert('Event deleted successfully!');
                                router.push('/events');
                            })
                            .catch((err) => {
                                console.error('deleteEvent failed', err);
                                alert(err.message || 'Failed to delete event');
                            });
        }
    };

    return (
        <div className="container">
            <div className="event-details">
                <h1>{event.title}</h1>

                <div className="event-info">
                    <div className="event-info-item">
                        <strong>📅 Date</strong>
                        <span>{event.date}</span>
                    </div>
                    <div className="event-info-item">
                        <strong>🕐 Time</strong>
                        <span>{event.time}</span>
                    </div>
                    <div className="event-info-item">
                        <strong>📍 Location</strong>
                        <span>{event.location}</span>
                    </div>
                    <div className="event-info-item">
                        <strong>🏷️ Category</strong>
                        <span>{event.category}</span>
                    </div>
                    <div className="event-info-item">
                        <strong>🆔 Event ID</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{event.id}</span>
                    </div>
                </div>

                <div className="event-description">
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>
                        About this event
                    </strong>
                    {event.description}
                </div>

                <div className="event-actions">
                    {isGuest ? (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'var(--secondary-color)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px solid var(--border-color)'
                        }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                Sign in to RSVP and interact with this event
                            </p>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('guestMode');
                                    router.push('/');
                                }}
                                className="btn btn-primary"
                            >
                                Sign In
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleRSVP}
                                className={`btn ${hasRSVPd ? 'btn-secondary' : 'btn-success'}`}
                            >
                                {hasRSVPd ? '✓ Cancel RSVP' : 'RSVP to Event'}
                            </button>

                            {isOwner && (
                                <>
                                    <button onClick={handleEdit} className="btn btn-primary">
                                        ✏️ Edit Event
                                    </button>
                                    <button onClick={handleDelete} className="btn btn-danger">
                                        🗑️ Delete Event
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="attendees-section">
                    <h2>Attendees ({event.attendees.length})</h2>
                    <div className="attendees-list">
                        {event.attendees.map((attendee: any) => (
                            <span key={attendee.id} className="attendee-badge">
                                👤 {attendee.id === (user?.id) ? 'Me' : attendee.username}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
