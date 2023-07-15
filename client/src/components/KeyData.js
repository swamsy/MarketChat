import InfoSection from './InfoSection';
import { formatLargeNum } from '../utilities/helperFunctions';

function KeyData({ companyData }) {
    return (
      <div className="key-data-section">
        <h1>Key Data</h1>
        <h3>Learn about Key Data</h3>
        <div className="info-section">
            <InfoSection 
                data={[
                ["Market cap", formatLargeNum(companyData.MarketCapitalization)],
                ["P/E ratio", companyData.PERatio],
                ["52 week range", `$${companyData['52WeekLow']} - $${companyData['52WeekHigh']}`],
                ["Dividend yield", `${(companyData.DividendYield * 100).toFixed(2)}%`],
                ["EPS", companyData.EPS],
                ]} 
            />
        </div>
      </div>

    );
  }
  
  export default KeyData;