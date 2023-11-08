import React, { Component } from "react";
import SlotPicker from "./slotPicker";
import Schedule from "./schedule";
const Slots = ({ username }) => {
  return (
    <div>
      <h1>Slots</h1>
      <h3>My schedule</h3>
      <Schedule username={username} />
      <h3>Add a slot</h3>
      <SlotPicker username={username} />
    </div>
  );
};

export default Slots;
