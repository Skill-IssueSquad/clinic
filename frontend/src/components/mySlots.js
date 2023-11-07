import React, { Component } from "react";
import SlotPicker from "./slotPicker";
import Schedule from "./schedule";
const Slots = () => {
  return (
    <div>
      <h1>Slots</h1>
      <p>My schedule</p>
      <Schedule />
      <p>Add a slot</p>
      <SlotPicker />
    </div>
  );
};

export default Slots;
