import { useState } from 'react';
import LearnModal from './LearnModal';
import InfoSection from './InfoSection';
import { formatLargeNum } from '../utilities/helperFunctions';

function KeyData({ companyData }) {
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
            ["Market cap", companyData ? formatLargeNum(companyData.MarketCapitalization) : "N/A"],
            ["P/E ratio", companyData ? companyData.PERatio : "N/A"],
            ["52 week range", companyData ? `$${companyData['52WeekLow']} - $${companyData['52WeekHigh']}` : "N/A"],
            ["Dividend yield", companyData ? `${(companyData.DividendYield * 100).toFixed(2)}%` : "N/A"],
            ["EPS", companyData ? companyData.EPS : "N/A"],
          ]} 
        />
      </div>
    </div>
  );
}

export default KeyData;
