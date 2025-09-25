"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import VideoRoom from "./components/VideoRoom";
import axios from "@/lib/axios";

function RoomContent() {
  const searchParams = useSearchParams();
  const [roomName, setRoomName] = useState(searchParams.get("room") || "");
  const [token, setToken] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const room = searchParams.get("room");
    if (room) {
      setRoomName(room);
      setIsJoining(true);
      setError("");
      handleJoinRoom(room);
    }
  }, [searchParams]);

  const handleJoinRoom = async (roomName: string) => {
    if (!roomName) return;

    try {
      const { data } = await axios.post("/api/room/token", { roomName });
      setToken(data.token);
      setIsInRoom(true);
      setIsJoining(false);
    } catch (error) {
      console.error("Error joining room:", error);
      setIsJoining(false);
      setError("Invalid room name. Please check your invitation link.");
    }
  };

  if (!roomName) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center">
            Room Name is required. Please join from the link provided in your
            email.
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-gray-800">{error}</p>
        </div>
      </div>
    );
  }

  if (isJoining) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Joining room...</h2>
          <p className="text-gray-600">
            Please wait while we connect you to {roomName}
          </p>
        </div>
      </div>
    );
  }

  return isInRoom ? (
    <VideoRoom
      roomName={roomName}
      token={token}
      onDisconnect={() => setIsInRoom(false)}
    />
  ) : null;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomContent />
    </Suspense>
  );
}
