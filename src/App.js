import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "whisparing-peer-server.onrender.com",
      port: 443,
      secure: true,
      path: "/peerjs",
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("✅ My peer ID is:", id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
        call.answer(stream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });

        call.on("error", (err) => {
          console.error("Call error:", err);
          alert("❌ Error during call.");
        });
      }).catch((err) => {
        console.error("Media error on answer:", err);
        alert("❌ Could not access camera/mic.");
      });
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      alert("❌ PeerJS connection error.");
    });
  }, []);

  const startCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play();

      const call = peerRef.current.call(remoteId, stream);

      if (!call) {
        alert("❌ Failed to start call. Target peer not found.");
        return;
      }

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });

      call.on("error", (err) => {
        console.error("Call error:", err);
        alert("❌ Error during outgoing call.");
      });
    }).catch((err) => {
      console.error("Media access error:", err);
      alert("❌ Could not access your camera/microphone.");
    });
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>📞 Minimal Video Chat</h2>
      <p><strong>Your ID:</strong> {peerId}</p>
      <input
        placeholder="Enter peer ID to call"
        value={remoteId}
        onChange={(e) => setRemoteId(e.target.value)}
        style={{ padding: "8px", width: "60%", marginBottom: 10 }}
      />
      <br />
      <button onClick={startCall} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Start Call
      </button>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 20 }}>
        <div>
          <h4>📷 Your Camera</h4>
          <video ref={localVideoRef} style={{ width: 300, backgroundColor: "#000" }} muted />
        </div>
        <div>
          <h4>👤 Friend</h4>
          <video ref={remoteVideoRef} style={{ width: 300, backgroundColor: "#000" }} />
        </div>
      </div>
    </div>
  );
}

export default App;
