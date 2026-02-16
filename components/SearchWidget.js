"use client";

export default function SearchWidget({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    location,
    setLocation,
    categories
}) {
    return (
        <div className="search-widget">
            <h3>🔍 Search & Filter Events</h3>
            <div className="search-filters">
                <div className="filter-item">
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label>Time Range</label>
                    <div className="time-range">
                        <input
                            type="time"
                            placeholder="Start"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                        <input
                            type="time"
                            placeholder="End"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-item">
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        placeholder="Search location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}


