import React, { useEffect, useState } from 'react';
import About from './About';
import KeyData from './KeyData';
import { getCompanyOverview } from '../services/api';

function CompanyOverview({ symbol }) {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCompanyOverview(symbol);
      setCompanyData(data);
    };
    fetchData();
  }, [symbol]);  // The effect will run again if the symbol prop changes

  return (
    <div>
      {companyData ? (
        <>
          <About companyData={companyData}/>
          <KeyData companyData={companyData}/>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CompanyOverview;
