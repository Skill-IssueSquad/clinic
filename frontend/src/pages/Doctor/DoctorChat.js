import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
import io from "socket.io-client";
import { Typography, TextField, Button, Paper } from "@mui/material";

const socket = io.connect("http://localhost:8080");
const Chat = () => {
  let show = false;
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
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
    const f = async () => {
      await socket.emit("join-room", {
        roomId: doctorUsername + patientUsername,
      });
      await socket.on("receive-message", (data) => {
        console.log("inside receive-message");
        if (
          data.message === null ||
          data.message === undefined ||
          data.message === "" ||
          data.roomId !== doctorUsername + patientUsername
        ) {
          return;
        }
        setMessages((prev) => [
          ...prev,
          {
            message: `${doctorUsername} : ${data.message} (${data.time})`,
            alignment: "left",
          },
        ]);
      });
    };
    f();
  }, []);
  const handleSendMessage = async () => {
    //event.preventDefault();
    if (
      currentMessage === "" ||
      currentMessage === null ||
      currentMessage === undefined
    ) {
      //alert("Please enter a message");
      return;
    }
    const messageData = {
      message: currentMessage,
      roomId: doctorUsername + patientUsername,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit("send-message", messageData);
    setMessages((prev) => [
      ...prev,
      {
        message: `You : ${currentMessage} (${messageData.time})`,
        alignment: "right",
      },
    ]);
    //document.getElementById("message").value = "";
    setCurrentMessage("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div>
      {show ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Paper
            style={{
              padding: "20px",
              marginTop: "20px",
              width: "400px",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              EL7A2NI Live Chat
            </Typography>
            <div
              style={{
                width: "100%",
                height: "300px",
                border: "1px solid black",
                overflowY: "auto",
                marginBottom: "10px",
              }}
            >
              {messages.map((message, index) => (
                <div style={{ textAlign: message.alignment }}>
                  <div
                    key={index}
                    style={{
                      padding: "5px",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      backgroundColor:
                        message.alignment === "right" ? "#4caf50" : "#2196f3",
                      color: "#fff",
                      display: "inline-block",
                      maxWidth: "70%",
                    }}
                  >
                    {message.message}
                  </div>
                  <br />
                </div>
              ))}
            </div>
            <TextField
              multiline
              rows={2}
              variant="outlined"
              fullWidth
              placeholder="Type your message..."
              id="message"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Paper>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Chat;
