"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { categories } from '@/lib/mockData';
import { getEventById, updateEvent, getCurrentUser, isEventOwner, Event } from '@/lib/eventUtils';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = parseInt(params.id as string);

    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push('/');
            return;
        }

        // Get event using utility function
        const foundEvent = getEventById(eventId);
        
        if (!foundEvent) {
            setError('Event not found');
            setLoading(false);
            return;
        }

        // Check authorization
        if (!isEventOwner(foundEvent, currentUser)) {
            setError('You are not authorized to edit this event');
            setLoading(false);
            return;
        }

        setEvent(foundEvent);

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

        setLoading(false);
    }, [eventId, router]);

    if (loading) {
        return (
            <div className="container">
                <div className="form-container">
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="form-container">
                    <h1>Error</h1>
                    <p style={{ color: 'var(--error-color, #dc3545)' }}>{error}</p>
                    <button 
                        onClick={() => router.push('/events')} 
                        className="btn btn-secondary"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const currentUser = getCurrentUser();
        if (!currentUser) {
            setError('You must be logged in to edit events');
            return;
        }

        // Form the time range string
        const timeRange = formData.startTime && formData.endTime
            ? `${formData.startTime} - ${formData.endTime}`
            : formData.startTime;

        // Update event using utility function with authorization
        const result = updateEvent(eventId, {
            title: formData.title,
            date: formData.date,
            time: timeRange,
            location: formData.location,
            category: formData.category,
            description: formData.description
        }, currentUser);

        if (result.success) {
            alert('Event updated successfully! ✅');
            router.push(`/events/${eventId}`);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="form-container">
            <h1>Edit Event</h1>
            <p className="form-subtitle">Update your event details</p>

            {error && (
                <div style={{ 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    padding: '12px', 
                    borderRadius: '4px', 
                    marginBottom: '1rem',
                    border: '1px solid #f5c6cb'
                }}>
                    {error}
                </div>
            )}

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
