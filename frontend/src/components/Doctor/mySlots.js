import React, { Component } from "react";
import SlotPicker from "./slotPicker";
import Schedule from "./schedule";
import { useState } from "react";
const Slots = ({ username }) => {
  const [slots, setSlots] = useState([]);
  const [selectedDay1, setSelectedDay1] = useState("");
  const [selectedDay2, setSelectedDay2] = useState("");
  return (
    <div>
      <h1>Slots</h1>
      <h3>My schedule</h3>
      <Schedule
        username={username}
        slots={slots}
        setSlots={setSlots}
        selectedDay1={selectedDay1}
        setSelectedDay1={setSelectedDay1}
      />
      <h3>Add a slot</h3>
      <SlotPicker
        username={username}
        slots={slots}
        setSlots={setSlots}
        selectedDay1={selectedDay1}
        selectedDay2={selectedDay2}
        setSelectedDay2={setSelectedDay2}
      />
    </div>
  );
};

export default Slots;
