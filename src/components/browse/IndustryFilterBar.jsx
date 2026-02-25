import React, { useState } from 'react';
import { industries } from '../../data/mockCompanies';
import {
    FiGlobe,
    FiBriefcase,
    FiCreditCard,
    FiShoppingCart,
    FiTrendingUp,
    FiBookOpen,
    FiActivity,
    FiPackage,
    FiCpu,
    FiCloud
} from 'react-icons/fi';
import './IndustryFilterBar.css';

const iconMap = {
    globe: <FiGlobe size={18} />,
    briefcase: <FiBriefcase size={18} />,
    creditcard: <FiCreditCard size={18} />,
    cart: <FiShoppingCart size={18} />,
    trending: <FiTrendingUp size={18} />,
    book: <FiBookOpen size={18} />,
    activity: <FiActivity size={18} />,
    package: <FiPackage size={18} />,
    cpu: <FiCpu size={18} />,
    cloud: <FiCloud size={18} />,
};

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
                            <span className="industry-chip__icon">
                                {iconMap[ind.icon]}
                            </span>
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
