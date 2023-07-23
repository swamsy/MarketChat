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
            ["Market cap", companyData ? formatLargeNum(companyData.MarketCapitalization) : "No data available"],
            ["P/E ratio", companyData ? companyData.PERatio : "No data available"],
            ["52 week range", companyData ? `$${companyData['52WeekLow']} - $${companyData['52WeekHigh']}` : "No data available"],
            ["Dividend yield", companyData ? `${(companyData.DividendYield * 100).toFixed(2)}%` : "No data available"],
            ["EPS", companyData ? companyData.EPS : "No data available"],
          ]} 
        />
      </div>
    </div>
  );
}

export default KeyData;
