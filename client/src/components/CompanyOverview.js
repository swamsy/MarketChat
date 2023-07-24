import { useEffect, useState } from 'react';
import About from './About';
import KeyData from './KeyData';
import { getCompanyOverview } from '../services/api';

function CompanyOverview({ symbol }) {
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getCompanyOverview(symbol);
      // Alphavantage Company Overview returns an empty object if no data is available
      if (Object.keys(data).length === 0) {
        setCompanyData(null);
      } else {
        setCompanyData(data);
      }
      setIsLoading(false);
    };
    fetchData();
    
  }, [symbol]);

  return (
    <div>
        <>
          <About companyData={companyData} isLoading={isLoading}/>
          <KeyData companyData={companyData} isLoading={isLoading}/>
        </>
    </div>
  );
}

export default CompanyOverview;
