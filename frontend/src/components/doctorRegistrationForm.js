import React, { useState } from "react";
import axios from "axios";
import { json } from "react-router-dom";

const DoctorRegisterationForm = () => {
 /* const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    dateOfBirth: "",
    hourlyRate: "",
    affiliatedHospital: "",
    educationalBackground: "",
  });
*/
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [affiliatedHospital, setAffiliatedHospital] = useState("");
  const [educationalBackground, setEducationalBackground] = useState("");
  const [personalId, setPersonalId] = useState();
  const [pharmacyDegree, setPharmacyDegree] = useState();
  const [workingLicense, setWorkingLicense] = useState();


  const [error, setError] = useState(null);
 /* const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };*/

  const handlePersonalIdChange = (e) => {
    setPersonalId(e.target.files[0]);
  };

  const handlePharmacyDegreeChange = (e) => {
    setPharmacyDegree(e.target.files[0]);
  };

  const handleWorkingLicenseChange = (e) => {
    setWorkingLicense(e.target.files[0]);
  };

  const handleSubmit = async (e) => {

    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('hourlyRate', hourlyRate);
    formData.append('affiliatedHospital', affiliatedHospital);
    formData.append('educationalBackground', educationalBackground);
    formData.append('documents', personalId);
    formData.append('documents', pharmacyDegree);
    formData.append('documents', workingLicense);


    e.preventDefault();
    /*const pharmacist = {
      username: formData.username,
      name: formData.name,
      password: formData.password,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      hourlyRate: formData.hourlyRate,
      affiliatedHospital: formData.affiliatedHospital,
      educationalBackground: formData.educationalBackground,
    };
*/
console.log(username)
console.log(name)
console.log(email)
console.log(password)
console.log(dateOfBirth)
console.log(hourlyRate)
console.log(affiliatedHospital)
console.log(educationalBackground)
console.log(personalId) 
console.log(pharmacyDegree)  
console.log(workingLicense)  


//console.log(id)   
 // console.log(pharmacist);

    /*const response = await axios.post(
      "http://localhost:8000/register/pharmacist",
      formData
    );
    console.log(response)
*/
try {
  const response = await axios.post('http://localhost:8000/register/doctor', formData);

  // If submission is successful, reset the form fields
  setUsername("");
  setName("");
  setPassword("");
  setEmail("");
  setDateOfBirth("");
  setHourlyRate("");
  setAffiliatedHospital("");
  setEducationalBackground("");
  setPersonalId(null);
  setPharmacyDegree(null);
  setWorkingLicense(null);
  e.target["pid"].value = [];
  e.target["pharmDegree"].value = [];
  e.target["workingLicense"].value = [];


  

  console.log("Pharmacist Application Submitted Successfully");
} catch (error) {
  console.log(error);
}
};

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}

        />
      </div>
      <div>
        <label>Real Name</label>
        <input
          type="text"
          name="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <label>Hourly Rate</label>
        <input
          type="number"
          name="hourlyRate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />
      </div>
      <div>
        <label>Affiliated Hospital</label>
        <input
          type="text"
          name="affiliatedHospital"
          value={affiliatedHospital}
          onChange={(e) => setAffiliatedHospital(e.target.value)}
        />
      </div>
      <div>
        <label>Educational Background</label>
        <input
          type="text"
          name="educationalBackground"
          value={educationalBackground}
          onChange={(e) => setEducationalBackground(e.target.value)}
        />
      </div>
      <div>
        PersonalId:
      <input type="file" name="pid" onChange={handlePersonalIdChange}/>
      </div>
      <div>
        Pharmacy Degree:
      <input type="file"  name="pharmDegree" onChange={handlePharmacyDegreeChange}/>
      </div>
      <div>
        Working License: 
      <input type="file" name="workingLicense" onChange={handleWorkingLicenseChange}/>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default DoctorRegisterationForm;
