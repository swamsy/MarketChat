import InfoSection from './InfoSection';
import { capitalizeWords } from '../utilities/helperFunctions';
import Spinner from './BeatLoader';

function About({ companyData, isLoading }) {
  return (
    <div className="about-section">
      <h1>About</h1>
      <div className="info-section">
        <p>{isLoading ? <Spinner/> : companyData ? companyData.Description: "No data available"}</p>
        <InfoSection 
          data={[
            ["Sector", companyData ? capitalizeWords(companyData.Sector) : "No data available"],
            ["Industry", companyData ? capitalizeWords(companyData.Industry) : "No data available"],
            ["Exchange", companyData ? companyData.Exchange : "No data available"],
            ["Country", companyData ? companyData.Country : "No data available"],
            ["Currency", companyData ? companyData.Currency : "No data available"],
          ]}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

export default About;
