import InfoSection from './InfoSection';

function About({ companyData }) {
    return (
      <div className="about-section">
        <h1>About</h1>
        <div className="info-section">
            <InfoSection 
                data={[
                ["Sector", companyData.Sector.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())],
                ["Industry", companyData.Industry.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())],
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