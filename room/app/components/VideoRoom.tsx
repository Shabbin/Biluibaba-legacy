import React, { useState, useEffect, useRef } from "react";
import Video from "twilio-video";
import {
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
} from "lucide-react";

interface VideoRoomProps {
  roomName: string;
  token: string;
  onDisconnect: () => void;
}

const VideoRoom: React.FC<VideoRoomProps> = ({
  roomName,
  token,
  onDisconnect,
}) => {
  const [room, setRoom] = useState<Video.Room | null>(null);
  const [participants, setParticipants] = useState<Video.Participant[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoTrack = useRef<Video.LocalVideoTrack | null>(null);
  const localAudioTrack = useRef<Video.LocalAudioTrack | null>(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const room = await Video.connect(token, {
          name: roomName,
          audio: true,
          video: true,
        });

        setRoom(room);
        room.participants.forEach(participantConnected);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);

        // Handle local participant's tracks
        room.localParticipant.videoTracks.forEach((publication) => {
          if (publication.track) {
            localVideoTrack.current = publication.track;
            publication.track.attach(localVideoRef.current!);
          }
        });

        room.localParticipant.audioTracks.forEach((publication) => {
          if (publication.track) {
            localAudioTrack.current = publication.track;
          }
        });
      } catch (error) {
        console.error("Error connecting to room:", error);
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, token]);

  const participantConnected = (participant: Video.Participant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);

    participant.on("trackSubscribed", (track) => {
      if (track.kind === "video") {
        track.attach(remoteVideoRef.current!);
      } else if (track.kind === "audio") {
        track.attach(new Audio());
      }
    });
  };

  const participantDisconnected = (participant: Video.Participant) => {
    // Clean up the participant's tracks
    participant.videoTracks.forEach((publication) => {
      if (publication.track) {
        publication.track.detach();
      }
    });
    participant.audioTracks.forEach((publication) => {
      if (publication.track) {
        publication.track.detach();
      }
    });
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  };

  const handleDisconnect = () => {
    if (room) {
      room.disconnect();
    }
    onDisconnect();
  };

  const toggleAudio = () => {
    if (localAudioTrack.current) {
      if (isAudioEnabled) {
        localAudioTrack.current.disable();
      } else {
        localAudioTrack.current.enable();
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack.current) {
      if (isVideoEnabled) {
        localVideoTrack.current.disable();
      } else {
        localVideoTrack.current.enable();
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="video-room">
      <div className="video-grid">
        <div className="local-participant">
          <video ref={localVideoRef} autoPlay playsInline muted />
          <div className="participant-info">
            <span>You</span>
          </div>
        </div>
        {participants.length > 0 && (
          <div className="remote-participant">
            <video ref={remoteVideoRef} autoPlay playsInline />
            <div className="participant-info">
              <span>Remote Participant</span>
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <button
          className={`control-button ${!isAudioEnabled ? "disabled" : ""}`}
          onClick={toggleAudio}
        >
          {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button
          className={`control-button ${!isVideoEnabled ? "disabled" : ""}`}
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>
        <button
          className="control-button disconnect"
          onClick={handleDisconnect}
        >
          <PhoneOff size={24} />
        </button>
      </div>

      <style jsx>{`
        .video-room {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #202124;
          color: white;
          overflow: hidden;
        }

        .video-grid {
          display: grid;
          width: 100%;
          height: 100%;
          gap: 8px;
          padding: 8px;
          box-sizing: border-box;
          height: calc(100vh - 96px);
        }

        @media (max-width: 768px) {
          .video-grid {
            grid-template-rows: 60% 40%;
            height: calc(100vh - 80px);
            padding: 4px;
            gap: 4px;
          }
        }

        @media (min-width: 769px) {
          .video-grid {
            grid-template-columns: repeat(
              auto-fit,
              minmax(min(400px, 100%), 1fr)
            );
          }
        }

        .local-participant,
        .remote-participant {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: #3c4043;
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .participant-info {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }

        .controls {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          padding: 6px;
          background: rgba(32, 33, 36, 0.95);
          border-radius: 32px;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .controls {
            bottom: 8px;
            gap: 4px;
            padding: 4px;
          }

          .participant-info {
            font-size: 12px;
            padding: 2px 6px;
          }
        }

        .control-button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: #3c4043;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          padding: 0;
        }

        @media (max-width: 768px) {
          .control-button {
            width: 36px;
            height: 36px;
          }

          .control-button svg {
            width: 20px;
            height: 20px;
          }
        }

        .control-button:hover {
          background: #4a4d51;
          transform: translateY(-1px);
        }

        .control-button:active {
          transform: translateY(0);
        }

        .control-button.disabled {
          background: #ea4335;
        }

        .control-button.disconnect {
          background: #ea4335;
        }

        .control-button.disconnect:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default VideoRoom;
