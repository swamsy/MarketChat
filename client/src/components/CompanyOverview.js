import React, { useEffect, useState } from 'react';
import About from './About';
import KeyData from './KeyData';
import { getCompanyOverview } from '../services/api';

function CompanyOverview({ symbol }) {
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);  // set loading state true when starting API call
      const data = await getCompanyOverview(symbol);
      // Check if the data object is empty, if so set to null
      if (Object.keys(data).length === 0) {
        setCompanyData(null);
      } else {
        setCompanyData(data);
      }
      setIsLoading(false);  // set loading state false when API call is done
    };
    fetchData();
    
  }, [symbol]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <About companyData={companyData}/>
          <KeyData companyData={companyData}/>
        </>
      )}
    </div>
  );
}

export default CompanyOverview;
