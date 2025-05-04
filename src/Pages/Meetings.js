import { useEffect, useRef, useState } from "react";
import './Meetings.css';

export function MeetingRoom() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);  // Store peer connection

  useEffect(() => {
    if (!isStarted) return;  // Don't run WebRTC setup if the session is not started

    // Create a new peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    setPeerConnection(pc);

    const isOfferer = window.confirm("Click OK to act as Offerer, Cancel to be Answerer");

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    async function startWebRTC() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        if (isOfferer) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          await fetch('http://3.111.47.203:8080/offer', {
            method: 'POST',
            body: JSON.stringify(pc.localDescription),
            headers: { 'Content-Type': 'application/json' }
          });

          let answer = null;
          while (!answer || !answer.type) {
            const res = await fetch('http://3.111.47.203:8080/answer');
            answer = await res.json();
            if (!answer || !answer.type) {
              console.log("Waiting for answer...");
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          const res = await fetch('http://3.111.47.203:8080/offer');
          const offer = await res.json();

          if (!offer || !offer.type) {
            alert("Offer not available yet. Please try again.");
            return;
          }

          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          await fetch('http://3.111.47.203:8080/answer', {
            method: 'POST',
            body: JSON.stringify(pc.localDescription),
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (error) {
        console.error("Error accessing media devices or signaling:", error);
        alert("Could not access camera/microphone or signaling failed: " + error.message);
      }
    }

    startWebRTC();

    return () => {
      // Clean up the peer connection when stopping or unmounting
      if (pc) {
        pc.close();
      }
    };
  }, [isStarted]);

  const handleSessionToggle = () => {
    if (isStarted) {
      // Stop the session by closing peer connection
      setIsStarted(false);
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
    } else {
      // Start the session
      setIsStarted(true);
    }
  };

  return (
    <div className="meeting-room-container">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">WebRTC Meeting Room</h2>
      <p className="text-gray-600 mb-6">Start a peer-to-peer video session using WebRTC</p>
      
      <div className="meeting-container">
        <div className="video-container">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Local Video</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="video-player"
          ></video>
        </div>
        
        <div className="video-container">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            className="video-player"
          ></video>
        </div>
      </div>

      <button
        onClick={handleSessionToggle}
        className="start-btn"
      >
        {isStarted ? "Stop Session" : "Start Session"}
      </button>
    </div>
  );
}
