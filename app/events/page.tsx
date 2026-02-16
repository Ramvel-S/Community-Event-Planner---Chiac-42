"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';
import SearchWidget from '@/components/SearchWidget';
import { categories } from '@/lib/mockData';
import { subscribeEvents } from '@/lib/eventService';

export default function EventsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({
        searchTerm: '',
        selectedCategory: 'All',
        selectedDate: '',
        startTime: '',
        endTime: '',
        location: ''
    });

    const [events, setEvents] = useState<any[]>([]);

    // Load events from localStorage or seed with mock data
    useEffect(() => {
        // Subscribe to Firestore events collection
        const unsub = subscribeEvents((docs) => {
            setEvents(docs || []);
        });
        return () => unsub && unsub();
    }, []);

    // Helper function to compare times
    const isTimeInRange = (eventTime: string, start: string, end: string) => {
        if (!start && !end) return true;

        // Handle time ranges (e.g. "10:00 - 12:00")
        let eventStartTime = eventTime;
        if (eventTime.includes(' - ')) {
            eventStartTime = eventTime.split(' - ')[0];
        }

        const eventMinutes = parseInt(eventStartTime.split(':')[0]) * 60 + parseInt(eventStartTime.split(':')[1]);

        if (start && !end) {
            const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
            return eventMinutes >= startMinutes;
        }

        if (!start && end) {
            const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
            return eventMinutes <= endMinutes;
        }

        const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
        const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
        return eventMinutes >= startMinutes && eventMinutes <= endMinutes;
    };

    // Filter events based on applied filters (only when user clicks Apply)
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(appliedFilters.searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(appliedFilters.searchTerm.toLowerCase());
        const matchesCategory = appliedFilters.selectedCategory === 'All' || event.category === appliedFilters.selectedCategory;
        const matchesDate = !appliedFilters.selectedDate || event.date === appliedFilters.selectedDate;
        const matchesTime = isTimeInRange(event.time, appliedFilters.startTime, appliedFilters.endTime);
        const matchesLocation = !appliedFilters.location || event.location.toLowerCase().includes(appliedFilters.location.toLowerCase());

        return matchesSearch && matchesCategory && matchesDate && matchesTime && matchesLocation;
    });

    return (
        <div className="container">
            <SearchWidget
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                location={location}
                setLocation={setLocation}
                categories={categories}
                // Apply filters only when user clicks Apply; reset clears both input and applied filters
                onApply={() => setAppliedFilters({ searchTerm, selectedCategory, selectedDate, startTime, endTime, location })}
                onReset={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedDate('');
                    setStartTime('');
                    setEndTime('');
                    setLocation('');
                    setAppliedFilters({ searchTerm: '', selectedCategory: 'All', selectedDate: '', startTime: '', endTime: '', location: '' });
                }}
            />

            <div className="events-section">
                <h2>Discover Community Events</h2>
                <div className="events-grid">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            No events found matching your criteria. Try adjusting your filters.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
