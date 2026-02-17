"use client";

// Event management utility functions

export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    description: string;
    created_by: number;
    attendees: Array<{ id: number; username: string }>;
    duration?: number; // Duration in minutes
}

export interface User {
    id: number;
    username: string;
    email: string;
}

// Helper function to parse time string and convert to minutes
export const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    
    // Handle time range format "HH:MM - HH:MM"
    if (timeStr.includes(' - ')) {
        const startTime = timeStr.split(' - ')[0];
        const [hours, minutes] = startTime.split(':').map(Number);
        return hours * 60 + minutes;
    }
    
    // Handle single time format "HH:MM"
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper function to calculate event duration in minutes
export const calculateEventDuration = (timeStr: string): number => {
    if (!timeStr) return 0;
    
    if (!timeStr.includes(' - ')) {
        return 0; // No end time specified
    }
    
    const [startTime, endTime] = timeStr.split(' - ');
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    // Handle cases where end time is next day (e.g., 22:00 - 01:00)
    if (endMinutes < startMinutes) {
        return (24 * 60) - startMinutes + endMinutes;
    }
    
    return endMinutes - startMinutes;
};

// Check for time conflicts between events
export const hasTimeConflict = (
    newEventDate: string,
    newEventTime: string,
    newEventLocation: string,
    existingEvents: Event[],
    excludeEventId?: number
): { hasConflict: boolean; conflictMessage: string } => {
    const newStartTime = timeToMinutes(newEventTime);
    const newDuration = calculateEventDuration(newEventTime);
    const newEndTime = newStartTime + newDuration;

    for (const event of existingEvents) {
        // Skip the event being edited
        if (excludeEventId && event.id === excludeEventId) {
            continue;
        }

        // Check for same date and location
        if (event.date === newEventDate && event.location.toLowerCase() === newEventLocation.toLowerCase()) {
            const existingStartTime = timeToMinutes(event.time);
            const existingDuration = calculateEventDuration(event.time);
            const existingEndTime = existingStartTime + existingDuration;

            // Check for time overlap
            const overlaps = 
                (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
                (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
                (newStartTime <= existingStartTime && newEndTime >= existingEndTime);

            if (overlaps) {
                return {
                    hasConflict: true,
                    conflictMessage: `Time conflict: "${event.title}" is already scheduled at ${event.location} from ${event.time}`
                };
            }
        }
    }

    return { hasConflict: false, conflictMessage: '' };
};

// Check if user is authorized to edit/delete an event
export const isEventOwner = (event: Event, user: User | null): boolean => {
    if (!user || !event) return false;
    return user.id === event.created_by;
};

// Get events from localStorage
export const getEvents = (): Event[] => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
};

// Save events to localStorage
export const saveEvents = (events: Event[]): void => {
    localStorage.setItem('events', JSON.stringify(events));
};

// Get current logged-in user
export const getCurrentUser = (): User | null => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return loggedInUser ? JSON.parse(loggedInUser) : null;
};

// Create new event with validation
export const createEvent = (
    eventData: Partial<Event>,
    user: User
): { success: boolean; message: string; event?: Event } => {
    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
        return { success: false, message: 'All required fields must be filled' };
    }

    // Get existing events
    const existingEvents = getEvents();

    // Check for time conflicts
    const conflictCheck = hasTimeConflict(
        eventData.date,
        eventData.time,
        eventData.location,
        existingEvents
    );

    if (conflictCheck.hasConflict) {
        return { success: false, message: conflictCheck.conflictMessage };
    }

    // Create new event
    const newEvent: Event = {
        id: Date.now(),
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category || 'Other',
        description: eventData.description || '',
        created_by: user.id,
        attendees: [{ id: user.id, username: user.username }],
        duration: calculateEventDuration(eventData.time)
    };

    // Save event
    const updatedEvents = [...existingEvents, newEvent];
    saveEvents(updatedEvents);

    return { success: true, message: 'Event created successfully!', event: newEvent };
};

// Update existing event with authorization check
export const updateEvent = (
    eventId: number,
    eventData: Partial<Event>,
    user: User
): { success: boolean; message: string } => {
    const existingEvents = getEvents();
    const eventIndex = existingEvents.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
        return { success: false, message: 'Event not found' };
    }

    const event = existingEvents[eventIndex];

    // Authorization check
    if (!isEventOwner(event, user)) {
        return { success: false, message: 'You are not authorized to edit this event' };
    }

    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
        return { success: false, message: 'All required fields must be filled' };
    }

    // Check for time conflicts (excluding current event)
    const conflictCheck = hasTimeConflict(
        eventData.date,
        eventData.time,
        eventData.location,
        existingEvents,
        eventId
    );

    if (conflictCheck.hasConflict) {
        return { success: false, message: conflictCheck.conflictMessage };
    }

    // Update event
    existingEvents[eventIndex] = {
        ...event,
        ...eventData,
        duration: calculateEventDuration(eventData.time)
    };

    saveEvents(existingEvents);

    return { success: true, message: 'Event updated successfully!' };
};

// Delete event with authorization check
export const deleteEvent = (
    eventId: number,
    user: User
): { success: boolean; message: string } => {
    const existingEvents = getEvents();
    const event = existingEvents.find(e => e.id === eventId);

    if (!event) {
        return { success: false, message: 'Event not found' };
    }

    // Authorization check
    if (!isEventOwner(event, user)) {
        return { success: false, message: 'You are not authorized to delete this event' };
    }

    // Remove event
    const updatedEvents = existingEvents.filter(e => e.id !== eventId);
    saveEvents(updatedEvents);

    return { success: true, message: 'Event deleted successfully!' };
};

// Get event by ID
export const getEventById = (eventId: number): Event | null => {
    const events = getEvents();
    return events.find(e => e.id === eventId) || null;
};
