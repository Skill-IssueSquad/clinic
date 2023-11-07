import React, { Component } from "react";
import SlotPicker from "./slotPicker";
import Schedule from "./schedule";
const Slots = ({ username }) => {
  return (
    <div>
      <h1>Slots</h1>
      <p>My schedule</p>
      <Schedule username={username} />
      <p>Add a slot</p>
      <SlotPicker username={username} />
    </div>
  );
};

export default Slots;
