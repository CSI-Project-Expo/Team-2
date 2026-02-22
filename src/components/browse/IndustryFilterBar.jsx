import React, { useState } from 'react';
import { industries } from '../../data/mockCompanies';
import './IndustryFilterBar.css';

const IndustryFilterBar = ({ onSelect, selected = 'all' }) => {
    return (
        <div className="industry-filter">
            <div className="industry-filter__wrapper">
                <div className="industry-filter__fade industry-filter__fade--left" />
                <div className="industry-filter__track" id="industry-scroll">
                    {industries.map(ind => (
                        <button
                            key={ind.id}
                            className={`industry-chip ${selected === ind.id ? 'industry-chip--active' : ''}`}
                            onClick={() => onSelect(ind.id)}
                        >
                            <span className="industry-chip__icon">{ind.icon}</span>
                            <div className="industry-chip__info">
                                <span className="industry-chip__name">{ind.name}</span>
                                <span className="industry-chip__count">{ind.count}</span>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="industry-filter__fade industry-filter__fade--right" />
            </div>
        </div>
    );
};

export default IndustryFilterBar;
