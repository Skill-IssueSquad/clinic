import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard'; // Import your Card component
import { Button, Breadcrumbs, Link, Typography } from '@mui/material';
import AddPackageDialouge from "./AddPackageDialouge";
import CircularProgress from '@mui/material/CircularProgress';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const Packages = ({refresh}) => {
    const [cardDataList, setCardDataList] = useState([]);
    const [refreshKey,setRefreshKey] = useState(0);
    const [showProgress, setShowProgress] = useState(true);
    const breadcrumbs = [
      <Link
        underline="hover"
        key="2"
        color="grey"
        href="/Admin"
        // onClick={handleClick}
      >
      {<HomeIcon style={{color: 'blue', opacity: 0.5}}></HomeIcon>}
      </Link>,
      <Typography key="3" color="grey">
        View Health Packages
      </Typography>,
    ];

    const handleRefresh = () => {
      setRefreshKey(1);
    }

    

    useEffect(() => {
      // Simulate fetching card data from a database (replace with actual API call)
      const fetchData = async () => {
        try {
          const response = await fetch('/admin/viewPackages', {credentials: 'include'});
          const json = await response.json();

          if (response.ok) {
            //json.data.sort((a, b) => a.name.localeCompare(b.name));
            setCardDataList(json.data); // Assuming data is an array of card data objects
            setShowProgress(false);
          } else {
            throw new Error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [cardDataList]); // Empty dependency array ensures the effect runs only once on component mount
  
    return (
      <div>
        <a style={{fontFamily: 'Arial, sans-serif', fontSize: '20px',color: '#333', fontWeight:'bold'}}>Health Packages
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        </a>
        <br/>
      {!showProgress && <div>
        {cardDataList.length > 0 ? (
          cardDataList.map((cardData, index) => (
            <PackageCard  data={cardData} key={index} onClick={handleRefresh}/>
          ))
        ) : (
          <div style={{backgroundColor: '#f0f0f0',paddingBottom: '600px'}}>
          No existing packages
          </div>
        )}
        <AddPackageDialouge />
      </div>}
      {showProgress && <CircularProgress color="inherit" style={{marginLeft:'650px', marginTop:'100px'}} />} 
      </div>
    );
}
 
export default Packages
;