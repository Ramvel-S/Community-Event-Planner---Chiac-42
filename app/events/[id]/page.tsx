"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockEvents } from '@/lib/mockData';

export default function EventDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = parseInt(Array.isArray(params?.id) ? params.id[0] : String(params?.id));

    const [event, setEvent] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [hasRSVPd, setHasRSVPd] = useState(false);

    useEffect(() => {
        // Fetch event from localStorage
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        // Fallback to mockEvents if localStorage is empty (shouldn't happen due to initialization in events page)
        const allEvents = storedEvents.length > 0 ? storedEvents : mockEvents;

        const foundEvent = allEvents.find((e: any) => e.id === eventId);
        setEvent(foundEvent);

        if (!foundEvent) return;

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
        const isAttending = foundEvent.attendees.some((a: any) => a.id === userData.id);
        setHasRSVPd(isAttending);

        // Also check legacy localStorage key just in case
        const rsvpKey = `rsvp_${userData.id}_${eventId}`;
        const rsvpStatus = localStorage.getItem(rsvpKey);
        if (rsvpStatus === 'true') setHasRSVPd(true);

    }, [router, eventId]);

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

        const newRSVPStatus = !hasRSVPd;
        setHasRSVPd(newRSVPStatus);

        // Update event attendees in localStorage
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const updatedEvents = storedEvents.map((e: any) => {
            if (e.id === event.id) {
                let updatedAttendees = [...e.attendees];
                if (newRSVPStatus) {
                    // Add user to attendees if not already there
                    if (!updatedAttendees.some((a: any) => a.id === user.id)) {
                        updatedAttendees.push({ id: user.id, username: user.username });
                    }
                } else {
                    // Remove user from attendees
                    updatedAttendees = updatedAttendees.filter((a: any) => a.id !== user.id);
                }
                // Update the local event object as well to reflect immediately in UI
                setEvent({ ...e, attendees: updatedAttendees });
                return { ...e, attendees: updatedAttendees };
            }
            return e;
        });

        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // Legacy support
        const rsvpKey = `rsvp_${user.id}_${eventId}`;
        localStorage.setItem(rsvpKey, newRSVPStatus.toString());

        if (newRSVPStatus) {

            if (newRSVPStatus) {
                alert('RSVP confirmed! See you at the event! 🎉');
            } else {
                alert('RSVP cancelled. Hope to see you at another event!');
            }
        };
    }

    const handleEdit = () => {
        router.push(`/edit-event/${event.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this event?')) {
            const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
            const updatedEvents = storedEvents.filter((e: any) => e.id !== event.id);
            localStorage.setItem('events', JSON.stringify(updatedEvents));

            alert('Event deleted successfully!');
            router.push('/events');
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
                                👤 {attendee.username}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
