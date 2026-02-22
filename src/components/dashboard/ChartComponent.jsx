import React, { useEffect, useState } from 'react';
import './ChartComponent.css';

const ChartComponent = ({ data = [], height = 200 }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Slight delay to trigger CSS animation on mount
        const timeout = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="custom-chart-container" style={{ height: `${height}px` }}>
            <div className="custom-chart-bars">
                {data.map((item, i) => {
                    const percentage = (item.value / maxVal) * 100;
                    return (
                        <div key={i} className="chart-bar-wrap">
                            <div
                                className="chart-bar"
                                style={{
                                    height: mounted ? `${percentage}%` : '0%',
                                    background: item.color || 'var(--gold-gradient)'
                                }}
                            >
                                <span className="chart-bar-tooltip">{item.value}</span>
                            </div>
                            <span className="chart-label">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChartComponent;
