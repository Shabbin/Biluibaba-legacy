import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Filter out the current image from thumbnails
  const thumbnailImages = images.filter((_, index) => index !== currentIndex);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Main Image */}
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
          <img
            src={`${images[currentIndex].path}?auto=format&fit=crop&w=1000&q=80`}
            alt={images[currentIndex].filename}
            className="h-full w-full object-cover transition-all duration-300"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition-all"
            >
              <LuChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white transition-all"
            >
              <LuChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {thumbnailImages.map((image) => {
              const index = images.findIndex((img) => img.id === image.id);
              return (
                <button
                  key={image.id}
                  onClick={() => goToSlide(index)}
                  className="w-full aspect-[4/3] overflow-hidden rounded-lg opacity-70 hover:opacity-100"
                >
                  <img
                    src={`${image.path}?auto=format&fit=crop&w=200&q=60`}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
            {/* Add placeholder thumbnails to maintain grid layout */}
            {Array.from({
              length: Math.max(0, 4 - thumbnailImages.length),
            }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="w-full aspect-[4/3] rounded-lg bg-gray-200"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
