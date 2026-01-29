import React, { useState } from 'react';
import './VideoPlayerMock.css';

interface VideoPlayerMockProps {
  subjectName: string;
  topicName: string;
}

export const VideoPlayerMock: React.FC<VideoPlayerMockProps> = ({
  subjectName,
  topicName,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5; // Имитация 5 слайдов/фрагментов видео

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="video-player-mock">
      <div className="video-header">
        <h3 className="video-subject">{subjectName}</h3>
        <p className="video-topic">{topicName}</p>
      </div>
      
      <div className="video-container">
        <button
          className="video-nav-btn video-nav-prev"
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          aria-label="Предыдущий слайд"
        >
          ←
        </button>
        
        <div className="video-content">
          <div className="video-placeholder">
            <div className="video-icon">📹</div>
            <p className="video-slide-info">
              Слайд {currentSlide + 1} из {totalSlides}
            </p>
            <p className="video-description">
              Здесь будет видео-урок по теме {'"'}{topicName}{'"'}
            </p>
          </div>
        </div>
        
        <button
          className="video-nav-btn video-nav-next"
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          aria-label="Следующий слайд"
        >
          →
        </button>
      </div>
      
      <div className="video-progress">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
