import React, { useState, useEffect } from 'react';

export default function Carousel({
  items = [],
  renderItem,
  autoplay = true,
  delay = 3500,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) setItemsPerView(3);
        else if (window.innerWidth >= 640) setItemsPerView(2);
        else setItemsPerView(1);
      }
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  useEffect(() => {
    if (!autoplay || maxIndex === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, delay);
    return () => clearInterval(timer);
  }, [autoplay, delay, maxIndex]);

  const slideWidth = 100 / itemsPerView;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
      >
        {items.map((item, i) => (
          <div
            key={item.id || i}
            style={{ width: `${slideWidth}%` }}
            className="flex-shrink-0 px-3 box-border"
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                i === currentIndex ? 'w-6 bg-primary' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
