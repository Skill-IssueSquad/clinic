// VideoCallPage.js
import React from "react";
import ResponsiveAppBar from "../components/navBar";
import VideoCall from "../components/Patient/VideoCallGrid";

const CallDoctor = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <h1>Call Doctor</h1>
      <VideoCall />
    </div>
  );
};

export default CallDoctor;
