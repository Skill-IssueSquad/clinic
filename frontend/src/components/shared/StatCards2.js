import { Card, Fab, Grid, Icon, lighten, styled, useTheme } from '@mui/material';
import PatientIcon from '@mui/icons-material/People'
import DoctorIcon from '@mui/icons-material/HealthAndSafety'
import AdminIcon from '@mui/icons-material/ManageAccounts'
import { blue } from '@mui/material/colors';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const ContentBox = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
}));

const FabIcon = styled(Fab)(() => ({
  width: '44px !important',
  height: '44px !important',
  boxShadow: 'none !important',
}));

const H3 = styled('h3')(({ textcolor }) => ({
  margin: 0,
  color: textcolor,
  fontWeight: '400',
  marginLeft: '12px',
}));

const H1 = styled('h1')(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  fontSize:'30px',
  color: theme.palette.text.secondary,
}));


const StatCards2 = () => {
  const { palette } = useTheme();
  const textError = palette.error.main;
  const bgError = lighten(palette.error.main, 0.85);
  const [adminCount, setAdminCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [showProgressAdmin, setShowProgressAdmin] = useState(true);
  const [showProgressDoctor, setShowProgressDoctor] = useState(true);
  const [showProgressPatient, setShowProgressPatient] = useState(true);

  useEffect(() => {
    // Replace this with your actual API call to fetch data from the database
    const fetchDataFromDatabase = async () => {
      try {
        // Fetch data from the database
        const response = await fetch('/admin/viewAdmins', {credentials: 'include',});
        const json = await response.json();
  
        if(response.ok){
            // Update the state with the fetched data
            const data = json.data
            setAdminCount(data.length);
            setShowProgressAdmin(false);
        }
      } catch (error) {
      console.error('Error fetching data:', error);
      }
      try {
            // Fetch data from the database
        const response = await fetch('/admin/viewDoctors', {credentials: 'include',});
        const json = await response.json();

        if(response.ok){
            // Update the state with the fetched data
            const data = json.data
            setDoctorCount(data.length);
            setShowProgressDoctor(false);
        }
        } catch (error) {
        console.error('Error fetching data:', error);
        }

        try {
          // Fetch data from the database
          const response = await fetch('/admin/viewPatients', {credentials: 'include',});
          const json = await response.json();

          if(response.ok){
              // Update the state with the fetched data
              const data = json.data
              setPatientCount(data.length);
              setShowProgressPatient(false);
          }
        } catch (error) {
        console.error('Error fetching data:', error);
        }

    };

    fetchDataFromDatabase();
    }, []);


  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={12}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: bgError }}>
              <AdminIcon/>
            </FabIcon>
            <H3 style={{color:'black'}}>Admins</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            {!showProgressAdmin && <H1>{adminCount}</H1>}
            {showProgressAdmin && <CircularProgress color="inherit" style={{marginLeft:'110px', marginTop:'10px'}} size={25} />} 
          </ContentBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={12}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: bgError }}>
              <DoctorIcon/>
            </FabIcon>
            <H3 style={{color:'navy'}}>Doctors</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
          {!showProgressDoctor && <H1>{doctorCount}</H1>}
            {showProgressDoctor && <CircularProgress color="inherit" style={{marginLeft:'110px', marginTop:'10px'}} size={25} />} 
          </ContentBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={12}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon
              size="medium"
              sx={{ background: 'rgba(9, 182, 109, 0.15)', overflow: 'hidden' }}
            >
              <PatientIcon/>
            </FabIcon>
            <H3 textcolor={'#08ad6c'}>Patients</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
          {!showProgressPatient && <H1>{patientCount}</H1>}
            {showProgressPatient && <CircularProgress color="inherit" style={{marginLeft:'110px', marginTop:'10px'}} size={25} />} 
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
