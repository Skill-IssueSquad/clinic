import React, { useEffect, useRef } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import io from "socket.io-client";
import Peer from "peerjs";

const VideoCall = () => {
  const videoGridRef = useRef(null);
  let myPeer;
  let peers = {};

  useEffect(() => {
    const roomId = window.location.pathname.split("/")[2];
    const socket = io("http://localhost:8001");
    myPeer = new Peer(undefined, {
      host: "/",
      port: "3001",
    });

    const myVideo = document.createElement("video");
    myVideo.muted = true;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);

        //when we recieve a call we want to answer it and send our stream to the caller
        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");

          //respond to the video stream
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });

          //if a user leaves the room we want to remove their video
          call.on("close", () => {
            video.remove();
          });
        });

        //if a new user joins the room we want to send our stream to that user
        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    //when a user disconnects we want to remove their video
    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    myPeer.on("open", (id) => {
      console.log("peer id", id);
      socket.emit("join-room", roomId, id);
    });
  }, []);

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    if (videoGridRef.current) {
      videoGridRef.current.appendChild(video);
    }
  };

  const connectToNewUser = (userId, stream) => {
    //call user with said userId and send our stream to that user
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");

    //when we recieve a stream from the user we called we want to add it to our video grid
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });

    //if a user leaves the room we want to remove their video
    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  };

  // Dummy data, replace with actual user data
  const users = [
    { id: 1, name: "John Doe", role: "Doctor" },
    { id: 2, name: "Jane Smith", role: "Patient" },
    // Add more users as needed
  ];

  return (
    <Grid container spacing={2} ref={videoGridRef}>
      <video autoPlay playsInline muted />
      {users.map((user) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
          {/* <Card>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.role}
              </Typography> 
            </CardContent>
          </Card> */}
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoCall;
