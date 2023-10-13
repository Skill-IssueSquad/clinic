import React, { useState } from "react";

const PatientRegisteration = () => {
  const [formData, setFormData] = useState({
    username: "",
    realName: "",
    password: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Real Name</label>
        <input
          type="text"
          name="realName"
          value={formData.realName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Gender</label>
        <input
          type="radio"
          name="gender"
          value="male"
          onChange={handleChange}
        />{" "}
        Male
        <input
          type="radio"
          name="gender"
          value="female"
          onChange={handleChange}
        />{" "}
        Female
      </div>
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mobile Number</label>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Emergency Contact Name</label>
        <input
          type="text"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Emergency Contact Number</label>
        <input
          type="tel"
          name="emergencyContactNumber"
          value={formData.emergencyContactNumber}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default PatientRegisteration;
