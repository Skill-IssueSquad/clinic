import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = ({ selected, onChange }) => {
  return <DatePicker selected={selected} onChange={onChange} />;
};

export default DateInput;
