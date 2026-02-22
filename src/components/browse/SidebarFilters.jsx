import React, { useState } from 'react';
import { FiFilter, FiX, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './SidebarFilters.css';

const companyTypes = ['Corporate', 'Foreign MNC', 'Startup', 'Product-Based', 'Service-Based'];
const locations = [
    { city: 'Bangalore', count: '3,421' },
    { city: 'Mumbai', count: '2,180' },
    { city: 'Hyderabad', count: '1,854' },
    { city: 'Delhi NCR', count: '1,632' },
    { city: 'Pune', count: '987' },
    { city: 'Chennai', count: '756' },
    { city: 'Remote', count: '4,200' },
];
const departments = ['Engineering', 'Design', 'Marketing', 'Finance', 'Sales', 'Operations', 'HR'];

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="filter-section">
            <button className="filter-section__header" onClick={() => setOpen(!open)}>
                <span>{title}</span>
                {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </button>
            {open && <div className="filter-section__body">{children}</div>}
        </div>
    );
};

const SidebarFilters = ({ onFiltersChange, onClose, isMobile = false }) => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [locationSearch, setLocationSearch] = useState('');

    const toggleItem = (list, setList, val) => {
        setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    };

    const clearAll = () => {
        setSelectedTypes([]);
        setSelectedLocations([]);
        setSelectedDepts([]);
    };

    const totalActive = selectedTypes.length + selectedLocations.length + selectedDepts.length;

    const filteredLocations = locations.filter(l =>
        l.city.toLowerCase().includes(locationSearch.toLowerCase())
    );

    return (
        <aside className={`sidebar-filters ${isMobile ? 'sidebar-filters--mobile' : ''}`}>
            <div className="sidebar-filters__header">
                <div className="filters-title">
                    <FiFilter size={16} />
                    <span>Filters</span>
                    {totalActive > 0 && <span className="active-count">{totalActive}</span>}
                </div>
                <div className="filters-actions">
                    {totalActive > 0 && (
                        <button className="clear-btn" onClick={clearAll}>Clear all</button>
                    )}
                    {isMobile && (
                        <button className="close-btn" onClick={onClose}>
                            <FiX size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="sidebar-filters__body">
                {/* Company Type */}
                <FilterSection title="Company Type">
                    {companyTypes.map(type => (
                        <label key={type} className="filter-option">
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => toggleItem(selectedTypes, setSelectedTypes, type)}
                                className="custom-checkbox"
                            />
                            <span className="checkmark" />
                            <span className="filter-option__label">{type}</span>
                        </label>
                    ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Location */}
                <FilterSection title="Location">
                    <div className="location-search">
                        <FiSearch size={14} />
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={locationSearch}
                            onChange={e => setLocationSearch(e.target.value)}
                            className="location-search-input"
                        />
                    </div>
                    {filteredLocations.map(loc => (
                        <label key={loc.city} className="filter-option">
                            <input
                                type="checkbox"
                                checked={selectedLocations.includes(loc.city)}
                                onChange={() => toggleItem(selectedLocations, setSelectedLocations, loc.city)}
                                className="custom-checkbox"
                            />
                            <span className="checkmark" />
                            <span className="filter-option__label">{loc.city}</span>
                            <span className="filter-option__count">{loc.count}</span>
                        </label>
                    ))}
                </FilterSection>

                <div className="filter-divider" />

                {/* Department */}
                <FilterSection title="Department">
                    {departments.map(dept => (
                        <label key={dept} className="filter-option">
                            <input
                                type="checkbox"
                                checked={selectedDepts.includes(dept)}
                                onChange={() => toggleItem(selectedDepts, setSelectedDepts, dept)}
                                className="custom-checkbox"
                            />
                            <span className="checkmark" />
                            <span className="filter-option__label">{dept}</span>
                        </label>
                    ))}
                </FilterSection>
            </div>

            <div className="sidebar-filters__footer">
                <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                    Apply Filters
                </button>
            </div>
        </aside>
    );
};

export default SidebarFilters;
