import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
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

  return (
    <div>
      {show ? (
        <div>
          <h1>Chat</h1>
          <p>Chatting ...</p>
          <div id="message-container"></div>
          <form id="send-container">
            <input type="text" id="message-input" />
            <button type="submit" id="send-button">
              Send
            </button>
          </form>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Chat;
