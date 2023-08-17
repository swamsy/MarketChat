import InfoSection from './InfoSection';
import { capitalizeWords, formatDate } from '../utilities/helperFunctions';
import { CustomBeatLoader } from './Loaders';
import styled from 'styled-components'

function About({ companyData, isLoading }) {
  return (
    <AboutContainer>
      <AboutContent>
        <h2>About</h2>
        <p>{isLoading ? <CustomBeatLoader/> : companyData ? companyData.Description: "—"}</p>
        <InfoSection 
          data={[
            ["Sector", companyData ? capitalizeWords(companyData.Sector) : "—"],
            ["Industry", companyData ? capitalizeWords(companyData.Industry) : "—"],
            ["Exchange", companyData ? companyData.Exchange : "—"],
            ["Country", companyData ? companyData.Country : "—"],
            ["Dividend Date", companyData ? formatDate(companyData.DividendDate) : "—"],
          ]}
          isLoading={isLoading} 
        />
      </AboutContent>
    </AboutContainer>
  );
}

const AboutContainer = styled.div`
  padding-top: 2.5rem;
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;


export default About;
