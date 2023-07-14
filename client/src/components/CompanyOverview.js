import React, { useEffect, useState } from 'react';
import About from './About';
import KeyData from './KeyData';

function CompanyOverview({ symbol }) {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=AAPL&apikey=your_api_key`);
      const data = await response.json();
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
