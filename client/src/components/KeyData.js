import { useState } from 'react';
import LearnModal from './LearnModal';
import InfoSection from './InfoSection';
import { formatLargeNum } from '../utilities/helperFunctions';

function KeyData({ companyData, isLoading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="key-data-section">
      <h1>Key Data</h1>
      <h3 onClick={() => setIsModalOpen(true)}>Learn about Key Data</h3>
      <LearnModal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
      <div className="info-section">
        <InfoSection 
          data={[
            ["Market cap", companyData ? formatLargeNum(companyData.MarketCapitalization) : "-"],
            ["P/E ratio", companyData ? companyData.PERatio : "-"],
            ["52 week range", companyData ? `$${companyData['52WeekLow']} - $${companyData['52WeekHigh']}` : "-"],
            ["Dividend yield", companyData ? `${(companyData.DividendYield * 100).toFixed(2)}%` : "-"],
            ["EPS", companyData ? companyData.EPS : "-"],
          ]}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

export default KeyData;
