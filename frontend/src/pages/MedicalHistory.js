import React, { useState, useEffect } from "react";
import axios from "axios";

const MedicalHistory = () => {
  const [email, setEmail] = useState("");
  const [File, setFile] = useState("");

 



    useEffect(() => {
    const fetchPatient = async () => {
      await axios.get("http://localhost:8000/patient/p8two").then((res) => {
        setEmail(res.data.data.email);
      });
    };

    
    fetchPatient();
    /*const formData = new FormData();
    formData.append('File', File);
    axios.post('http://localhost:8000/patients/p8two/healthrecords', formData )*/



  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
    <div>
      <h1>Medical History</h1>
    
      {email && (
        <p>
          Patient's Email: {email}
        </p>
      )}

      <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
        

    </div>
  );
};

export default MedicalHistory;
