import * as React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ViewInfo = ()=> {
    const [text, setText] = React.useState('');
    const location = useLocation();
    const [selectedID, setSelectedID] = useState(null);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [selectedDegree, setSelectedDegree] = useState(null);

    
    let username;
    if(location.state!=null){
        username = location.state.username;
        localStorage.setItem('username', username);
    }
    else{
        username = localStorage.getItem('username');
    }

    const handleIDChange = (event) => {
        const file = event.target.files[0];
        setSelectedID(file);
    };

    const handleLicenseChange = (event) => {
        const file = event.target.files[0];
        setSelectedLicense(file);
    };

    const handleDegreeChange = (event) => {
        const file = event.target.files[0];
        setSelectedDegree(file);
    };

     const handleUploadDocuments = async () => {
        try {
            const formData = new FormData();
            formData.append('documents', selectedID);
            formData.append('documents', selectedLicense);
            formData.append('documents', selectedDegree);

            const response = await axios.patch('http://localhost:8000/doctorRequest/updateInfo/' + username, formData, {
                withCredentials: true,
              });


            console.log(response)

            if(response){
                console.log("updated");
            }
            else{
                console.log("failed");
            }

        } catch (error) {
            console.log(error);

        }
    }



    useEffect(() => {
        const getInfo = async () => {
            try {
                console.log(username);
                const response = await fetch('/doctorRequest/viewInfo' , {method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({username}),});
        
                const json = await response.json();
        
                if(response.ok){
                    const info = json.data[0];
                    const textParagraph = [
                        "Name: " + info.name +"\n",
                        "Email: " + info.email,
                        "Date of Birth" + info.dateOfBirth,
                        "Username: " + info.username,
                        "Hourly Rate: " + info.hourlyRate,
                        "Affiliate Hospital: " +info.affiliatedHospital,
                        "Educational Background: " + info.educationalBackground,
                        "Status: " + info.status,
                    ]
                    setText(textParagraph);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    getInfo();    
    }, []);


    return (
        <div>
            <Card>
            {text && text.map((data, index) => (
                <p>{data}
                </p>
                ))
            }
            <input type="file" onChange={handleIDChange} />
            {/* <Button  color="primary" variant="contained" style={{top:'0px', left:'400px'}} onClick={handleUploadID}>Upload ID</Button> */}
            <input type="file" onChange={handleLicenseChange} />
            {/* <Button  color="primary" variant="contained" style={{top:'0px', left:'400px'}} onClick={handleUploadLicense}>Upload License</Button> */}
            <input type="file" onChange={handleDegreeChange} />
            <br/>
            <Button  color="primary" variant="contained" style={{top:'0px', left:'400px'}} onClick={handleUploadDocuments}>Upload Documents</Button>
            </Card>
        </div>
    );
}

export default ViewInfo;