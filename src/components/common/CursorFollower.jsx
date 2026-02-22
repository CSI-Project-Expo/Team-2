import React, { useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const cursorRef = useRef(null);
    const posRef = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            const dx = posRef.current.x - currentPos.current.x;
            const dy = posRef.current.y - currentPos.current.y;
            currentPos.current.x += dx * 0.1;
            currentPos.current.y += dy * 0.1;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${currentPos.current.x - 20}px, ${currentPos.current.y - 20}px)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };

        const handleMouseEnterInteractive = () => {
            if (cursorRef.current) cursorRef.current.classList.add('hover');
        };

        const handleMouseLeaveInteractive = () => {
            if (cursorRef.current) cursorRef.current.classList.remove('hover');
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Add hover effect to interactive elements
        const addListeners = () => {
            const interactives = document.querySelectorAll('a, button, input, [role="button"], .glass-card');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnterInteractive);
                el.addEventListener('mouseleave', handleMouseLeaveInteractive);
            });
        };

        // Initial add + observe DOM changes
        addListeners();
        const observer = new MutationObserver(addListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafRef.current);
            observer.disconnect();
        };
    }, []);

    return <div ref={cursorRef} className="cursor-follower" />;
};

export default CursorFollower;
