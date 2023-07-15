import InfoSection from './InfoSection';
import { capitalizeWords } from '../utilities/helperFunctions.js';

function About({ companyData }) {
    return (
      <div className="about-section">
        <h1>About</h1>
        <div className="info-section">
            <InfoSection 
                data={[
                ["Sector", capitalizeWords(companyData.Sector)],
                ["Industry", capitalizeWords(companyData.Industry)],
                ["Exchange", companyData.Exchange],
                ["Country", companyData.Country],
                ["Currency", companyData.Currency],
                ]} 
            />
        </div>
      </div>
    );
  }
  
  export default About;