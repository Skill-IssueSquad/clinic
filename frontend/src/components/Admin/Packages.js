import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard'; // Import your Card component
import { Button } from '@mui/material';
import AddPackageDialouge from "./AddPackageDialouge";

const Packages = ({refresh}) => {
    const [cardDataList, setCardDataList] = useState([]);
    const [refreshKey,setRefreshKey] = useState(0);

    const handleRefresh = () => {
      setRefreshKey(1);
    }

    

    useEffect(() => {
      // Simulate fetching card data from a database (replace with actual API call)
      const fetchData = async () => {
        try {
          const response = await fetch('/admin/viewPackages');
          const json = await response.json();

          if (response.ok) {
            //json.data.sort((a, b) => a.name.localeCompare(b.name));
            console.log(json.data);
            setCardDataList(json.data); // Assuming data is an array of card data objects
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
        {cardDataList.length > 0 ? (
          cardDataList.map((cardData, index) => (
            <PackageCard  data={cardData} key={index} onClick={handleRefresh}/>
          ))
        ) : (
          <div>
          No existing packages
          </div>
        )}
        <AddPackageDialouge />
      </div>
    );
}
 
export default Packages
;