import React from "react";
import "./VideoPlayerMock.css";

interface VideoPlayerMockProps {
  subjectName: string;
  topicName: string;
}

export const VideoPlayerMock: React.FC<VideoPlayerMockProps> = ({
  subjectName,
  topicName,
}) => {
  return (
    <div className="video-player-mock">
      <div className="video-header">
        <h3 className="video-subject">{subjectName}</h3>
        <p className="video-topic">{topicName}</p>
      </div>

      <div className="video-container">
        <div className="video-content">
          <div className="video-placeholder"></div>
        </div>
      </div>
    </div>
  );
};
