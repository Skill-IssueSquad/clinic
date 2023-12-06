import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../Protected/AuthProvider";
import io from "socket.io-client";

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
          data.message === ""
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
      senderUsername: isDoctor ? doctorUsername : patientUsername,
      receiverUsername: isDoctor ? patientUsername : doctorUsername,
      isDoctor,
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
    document.getElementById("message").value = "";
    setCurrentMessage("");
  };
  return (
    <div>
      {show ? (
        <div>
          <div style={{ textAlign: "center" }}>
            <h1>EL7A2NI Live Chat</h1>
          </div>
          <div
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid black",
              overflow: "scroll",
            }}
          >
            {messages.map((m) => {
              return (
                <div style={{ textAlign: m.alignment }}>
                  <p>{m.message}</p>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center" }}>
            <input
              type="text"
              id="message"
              placeholder="Enter Message"
              style={{ width: "50%" }}
              onChange={(e) => {
                setCurrentMessage(e.target.value);
              }}
            />
            <button
              onClick={() => {
                handleSendMessage();
              }}
            >
              &#9658;
            </button>
          </div>
        </div>
      ) : (
        <h2>No access</h2>
      )}
    </div>
  );
};

export default Chat;
