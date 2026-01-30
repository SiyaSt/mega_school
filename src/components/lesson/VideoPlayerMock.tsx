import React from "react";
import "./VideoPlayerMock.css";
import videoBg from "../../assets/IMG_3634 (2).mp4";

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
          <div className="video-placeholder">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="hero-video-bg"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            >
              <source src={videoBg} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};
