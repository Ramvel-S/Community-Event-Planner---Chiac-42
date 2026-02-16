"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { mockEvents, categories } from '@/lib/mockData';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = parseInt(Array.isArray(params?.id) ? params.id[0] : String(params?.id));

    const [event, setEvent] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        category: 'Music',
        description: ''
    });

    useEffect(() => {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            router.push('/');
            return;
        }

        // Fetch event from Firestore (via subscription handled in event details page)
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const allEvents = storedEvents.length > 0 ? storedEvents : [];
        const foundEvent = allEvents.find((e: any) => e.id === eventId) || null;
        setEvent(foundEvent);

        if (foundEvent) {
            // Parse existing time string to separate start and end times
            let start = '';
            let end = '';

            if (foundEvent.time) {
                if (foundEvent.time.includes(' - ')) {
                    const parts = foundEvent.time.split(' - ');
                    start = parts[0];
                    end = parts[1];
                } else {
                    start = foundEvent.time;
                }
            }

            setFormData({
                title: foundEvent.title,
                date: foundEvent.date,
                startTime: start,
                endTime: end,
                location: foundEvent.location,
                category: foundEvent.category,
                description: foundEvent.description
            });
        }
    }, [eventId, router]);

    if (!event) {
        return (
            <div className="container">
                <div className="form-container">
                    <h1>Event Not Found</h1>
                    <p>The event you're trying to edit doesn't exist.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const timeRange = formData.startTime && formData.endTime
            ? `${formData.startTime} - ${formData.endTime}`
            : formData.startTime;

        // Update event in localStorage
        const storedEvents2 = JSON.parse(localStorage.getItem('events') || '[]');
        const updatedEvents = storedEvents2.map((e: any) => {
            if (e.id === eventId) {
                return {
                    ...e,
                    title: formData.title,
                    date: formData.date,
                    time: timeRange,
                    location: formData.location,
                    category: formData.category,
                    description: formData.description
                };
            }
            return e;
        });

        // Optimistically update localStorage for offline UX; Firestore update will be handled elsewhere or via a follow-up action
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        alert('Event updated locally. If using Firestore, please sync or re-open the event to refresh.');
        router.push(`/events/${eventId}`);
    };

    return (
        <div className="form-container">
            <h1>Edit Event</h1>
            <p className="form-subtitle">Update your event details</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Event Title</label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Time Range</label>
                    <div className="time-range-inputs" style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="startTime" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Start Time</label>
                            <input
                                id="startTime"
                                type="time"
                                required
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="endTime" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>End Time</label>
                            <input
                                id="endTime"
                                type="time"
                                required
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {categories.filter(cat => cat !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-full">Update Event</button>
            </form>
        </div>
    );
}
