import React, { useEffect, useRef } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const VideoCall = () => {
  const gridContainerRef = useRef(null);

  useEffect(() => {
    // Your socket and peerJS logic here

    // Dummy function to simulate adding video feeds
    const addVideoFeed = (userId, name, role) => {
      const newCard = document.createElement("div");
      newCard.innerHTML = `
        <div style="width: 100%; position: relative; padding-top: 56.25%;">
          <video
            autoplay
            muted
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          ></video>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(255, 255, 255, 0.8); padding: 8px;">
            <div>${name}</div>
            <div>${role}</div>
          </div>
        </div>
      `;

      const gridContainer = gridContainerRef.current;
      if (gridContainer) {
        gridContainer.appendChild(newCard);
      }

      // Your logic to handle peerJS call and video stream here
      // Example: const call = peer.call(userId, stream);
      // call.on('stream', (remoteStream) => {
      //   const videoElement = newCard.querySelector('video');
      //   videoElement.srcObject = remoteStream;
      // });
    };

    // Example: Call addVideoFeed when someone joins the room
    // addVideoFeed('userId1', 'John Doe', 'Doctor');

    // Cleanup logic when the component unmounts
    return () => {
      // Your cleanup logic here
    };
  }, []);

  return (
    <Grid
      container
      spacing={2}
      ref={gridContainerRef}
      style={{ height: "100vh", padding: "20px" }}
    >
      {/* Video feeds dynamically added here */}
    </Grid>
  );
};

export default VideoCall;
