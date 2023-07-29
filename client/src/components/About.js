import InfoSection from './InfoSection';
import { capitalizeWords } from '../utilities/helperFunctions';
import Spinner from './BeatLoader';
import styled from 'styled-components'

function About({ companyData, isLoading }) {
  return (
    <AboutContainer>
      <AboutContent>
        <h2>About</h2>
        <p>{isLoading ? <Spinner/> : companyData ? companyData.Description: "—"}</p>
        <InfoSection 
          data={[
            ["Sector", companyData ? capitalizeWords(companyData.Sector) : "—"],
            ["Industry", companyData ? capitalizeWords(companyData.Industry) : "—"],
            ["Exchange", companyData ? companyData.Exchange : "—"],
            ["Country", companyData ? companyData.Country : "—"],
            ["Currency", companyData ? companyData.Currency : "—"],
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
