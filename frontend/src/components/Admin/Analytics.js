import { Card, Grid, styled, Button, Box, Breadcrumbs, Typography} from '@mui/material';
import { Fragment, useState } from 'react';
import StatCards from '../shared/StatCards';
import StatCards2 from '../shared/StatCards2';
import { Span } from '../shared/Typography';
import TransactionTable from '../shared/TransactionTable';
import ReminderTable from '../shared/ReminderTable';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';


const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));


const handleClick = async() => {
  localStorage.setItem('selectedItem', "View Join Requests")
}

const Analytics = () => {
  const [requestList, setRequestList] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const breadcrumbs = [
    <Link
      underline="hover"
      key="2"
      color="grey"
      href="/Admin"
    >
    {<HomeIcon style={{color: 'blue', opacity: 0.5}}></HomeIcon>}
    </Link>,
    <Typography key="3" color="grey">
      Dashboard
    </Typography>,
  ];

  useEffect(() => {
    // Replace this with your actual API call to fetch data from the database
    const fetchDataFromDatabase = async () => {
        try {
            // Fetch data from the database
            const response = await fetch('/admin/viewInfo', {credentials: 'include',});
            const json = await response.json();

            if(response.ok){
                // Update the state with the fetched data
                const data = json.data
                setRequestList(data.slice(-5));
               setShowProgress(false);
            }
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    fetchDataFromDatabase();
    }, []);
  return (
    <Fragment>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {<StatCards />}

          <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Recent Requests </Title>

              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  component={Link}
                  to="/Admin/ViewRequests"
                  sx={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    ml: 0,
                  }}
                  onClick={handleClick}
                >
                  <Span sx={{ pl: 1, textTransform: 'capitalize' }}>View All Join Requests</Span>
                </Button>
              </Box>

              {!showProgress && <TransactionTable
                subscribarList={requestList}
              />}
              {showProgress && <CircularProgress color="inherit" style={{marginLeft:'325px', marginTop:'50px'}} />} 
            </Card>
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Current Month Stats</Title>
              <StatCards2 style={{marginTop: '50px'}}/>
            </Card>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
