"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/mockData';
import { createEvent } from '@/lib/eventService';

export default function CreateEventPage() {
    const router = useRouter();
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
        // Check if user is in guest mode
        const guestMode = localStorage.getItem('guestMode');
        if (guestMode === 'true') {
            alert('Please sign in to create events');
            router.push('/');
            return;
        }

        // Check if user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            router.push('/');
        }
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Form the time range string
        const timeRange = formData.startTime && formData.endTime
            ? `${formData.startTime} - ${formData.endTime}`
            : formData.startTime;

        // Get current user
        const stored = localStorage.getItem('loggedInUser');
        const loggedInUser = stored ? JSON.parse(stored) : null;

        // Create new event object (do NOT auto-add creator to attendees)
        const newEvent = {
            title: formData.title,
            date: formData.date,
            time: timeRange,
            location: formData.location,
            category: formData.category,
            description: formData.description,
            created_by: loggedInUser ? loggedInUser.id : 'guest',
            attendees: []
        };

        try {
            await createEvent(newEvent);
            alert('Event created successfully! 🎉');
            router.push('/events');
        } catch (err: any) {
            console.error(err);
            alert('Failed to create event');
        }
    };

    return (
        <div className="form-container">
            <h1>Create New Event</h1>
            <p className="form-subtitle">Share your event with the community</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Event Title</label>
                    <input
                        id="title"
                        type="text"
                        required
                        placeholder="Enter event title"
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
                        placeholder="Enter event location"
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
                        placeholder="Describe your event..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-full">Create Event</button>
            </form>
        </div>
    );
}
