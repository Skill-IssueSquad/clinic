import React, { Component } from "react";
import SlotPicker from "./slotPicker";
import Schedule from "./schedule";
import { useState } from "react";
const Slots = ({ username }) => {
  const [slots, setSlots] = useState([]);
  return (
    <div>
      <h1>Slots</h1>
      <h3>My schedule</h3>
      <Schedule username={username} slots={slots} setSlots={setSlots} />
      <h3>Add a slot</h3>
      <SlotPicker username={username} slots={slots} setSlots={setSlots} />
    </div>
  );
};

export default Slots;
