import InfoSection from './InfoSection';
import { capitalizeWords } from '../utilities/helperFunctions';
import Spinner from './BeatLoader';

function About({ companyData, isLoading }) {
  return (
    <div className="about-section">
      <h1>About</h1>
      <div className="info-section">
        <p>{isLoading ? <Spinner/> : companyData ? companyData.Description: "-"}</p>
        <InfoSection 
          data={[
            ["Sector", companyData ? capitalizeWords(companyData.Sector) : "-"],
            ["Industry", companyData ? capitalizeWords(companyData.Industry) : "-"],
            ["Exchange", companyData ? companyData.Exchange : "-"],
            ["Country", companyData ? companyData.Country : "-"],
            ["Currency", companyData ? companyData.Currency : "-"],
          ]}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

export default About;
