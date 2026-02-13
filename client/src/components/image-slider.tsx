import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ProductImage } from "@/src/types";

interface ImageSliderProps {
  images: ProductImage[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToPrevious = (): void => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (): void => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  // Filter out the current image from thumbnails
  const thumbnailImages = images.filter((_, index) => index !== currentIndex);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Main Image */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 mb-4">
          <img
            src={`${images[currentIndex].path}?auto=format&fit=crop&w=1000&q=80`}
            alt={images[currentIndex].filename}
            className="h-full w-full object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnails with Navigation Arrows */}
        {images.length > 1 && (
          <div className="relative mt-4">
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-10 flex items-center justify-center rounded-tr-md rounded-br-md bg-white hover:bg-white transition-all hover:bg-opacity-100"
            >
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-10 flex items-center justify-center rounded-tr-md rounded-br-md bg-white hover:bg-white transition-all hover:bg-opacity-100"
            >
              <LuChevronRight className="w-5 h-5" />
            </button>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-4 gap-4">
              {thumbnailImages.map((image) => {
                const index = images.findIndex((img) => img.id === image.id);
                return (
                  <button
                    key={image.id}
                    onClick={() => goToSlide(index)}
                    className="w-full aspect-[4/3] overflow-hidden opacity-70 hover:opacity-100"
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
          </div>
        )}
      </div>
    </div>
  );
}
