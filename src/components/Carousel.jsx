'use client';

import React, { useEffect, useRef, useState } from "react";

function Carousel ({children}) {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragMoved, setDragMoved] = useState(false);
  
    useEffect(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
  
      const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carousel.offsetLeft);
        setScrollLeft(carousel.scrollLeft);
        setDragMoved(false);
      };
  
      const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) setDragMoved(true);
        carousel.scrollLeft = scrollLeft - walk;
      };
  
      const handleMouseUp = () => setIsDragging(false);
      const handleMouseLeave = () => setIsDragging(false);
  
      carousel.addEventListener('mousedown', handleMouseDown);
      carousel.addEventListener('mousemove', handleMouseMove);
      carousel.addEventListener('mouseup', handleMouseUp);
      carousel.addEventListener('mouseleave', handleMouseLeave);
  
      return () => {
        carousel.removeEventListener('mousedown', handleMouseDown);
        carousel.removeEventListener('mousemove', handleMouseMove);
        carousel.removeEventListener('mouseup', handleMouseUp);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [isDragging, startX, scrollLeft]);
  
    const handleClick = (e) => {
      if (dragMoved) e.preventDefault();
    };
  
    return (
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        {React.Children.map(children, (child, index) => (
            <>
                {child}
            </>
        ))}
      </div>
    );
}

export default Carousel