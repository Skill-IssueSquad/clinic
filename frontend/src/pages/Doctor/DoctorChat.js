import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8080");
const Chat = () => {
  let show = false;
  const navigate = useNavigate();
  const location = useLocation();
  var doctorUsername = "";
  var patientUsername = "";
  if (
    auth() &&
    (localStorage.getItem("role") === "Doctor" ||
      localStorage.getItem("role") === "Patient")
  ) {
    show = true;
    if (localStorage.getItem("role") === "Doctor") {
      doctorUsername = localStorage.getItem("username");
      patientUsername = location.state.username;
    }

    if (localStorage.getItem("role") === "Patient") {
      patientUsername = localStorage.getItem("username");
      doctorUsername = location.state.username;
    }
  }
  useEffect(() => {
    socket.emit("join-room", {
      roomId: doctorUsername + patientUsername,
    });
  }, []);
  return (
    <div>
      {show ? (
        <div>
          <h1>Chat</h1>
          <p>Chatting ...</p>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Chat;
