import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
const Chat = () => {
  let show = false;
  if (auth() && localStorage.getItem("role") === "Doctor") {
    show = true;
  }
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const location = useLocation();
  const patientID = location.state.patientID;
  console.log(patientID);

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
