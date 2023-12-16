// VideoCallPage.js
import React from "react";
import VideoCall from "../components/Patient/VideoCallGrid";
import { auth } from "./Protected/AuthProvider";

const CallDoctor = () => {
  let show = false;

  if (
    auth() &&
    (localStorage.getItem("role") === "Patient" ||
      localStorage.getItem("role") === "Doctor")
  ) {
    show = true;
  }
  return (
    <div>
      {show ? (
        <div>
          <h1>Video Call</h1>
          <VideoCall />
        </div>
      ) : (
        <h1>Not Authorized</h1>
      )}
    </div>
  );
};

export default CallDoctor;
