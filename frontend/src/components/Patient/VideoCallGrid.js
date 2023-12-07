import React, { useEffect, useRef, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import io from "socket.io-client";
import Peer from "peerjs";

const VideoCall = () => {
  const videoGridRef = useRef(null);
  const peers = {};
  const roomId = window.location.pathname.split("/")[2];
  const socket = io("http://localhost:8001");
  const myPeer = new Peer(undefined, {
    host: "/",
    port: "3001",
  });

  useEffect(() => {
    //when we connect we want to create a video stream and send it to the server
    const myVideo = document.createElement("video");
    myVideo.muted = true;

    myPeer.on("open", (id) => {
      console.log("peer id", id);
      socket.emit("join-room", roomId, id);
    });

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
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    //when a user disconnects we want to remove their video
    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });
  }, []);

  const connectToNewUser = (userId, stream) => {
    //call user with said userId and send our stream to that user
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");

    peers[userId] = call;

    //when we recieve a stream from the user we called we want to add it to our video grid
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });

    //if a user leaves the room we want to remove their video
    call.on("close", () => {
      video.remove();
    });
  };

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    videoGridRef.current.appendChild(video);
  };

  //return a video grid i will append videos to
  return (
    <Grid container spacing={2} ref={videoGridRef}>
      <video autoPlay playsInline muted />
    </Grid>
  );
};

export default VideoCall;
