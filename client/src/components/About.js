import InfoSection from './InfoSection';
import { capitalizeWords } from '../utilities/helperFunctions';

function About({ companyData }) {
  return (
    <div className="about-section">
      <h1>About</h1>
      <div className="info-section">
        <InfoSection 
          data={[
            ["Sector", companyData ? capitalizeWords(companyData.Sector) : "N/A"],
            ["Industry", companyData ? capitalizeWords(companyData.Industry) : "N/A"],
            ["Exchange", companyData ? companyData.Exchange : "N/A"],
            ["Country", companyData ? companyData.Country : "N/A"],
            ["Currency", companyData ? companyData.Currency : "N/A"],
          ]} 
        />
      </div>
    </div>
  );
}

export default About;
